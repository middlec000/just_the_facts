/**
 * SQLite-backed data store.
 * Exports the same function signatures as the previous JSON-file store so
 * that no page or component imports need to change.
 */

import { db } from "./db";
import type { Statement, Argument, Evidence, User } from "./types";

// ---------------------------------------------------------------------------
// Internal row ↔ domain-type mappers
// ---------------------------------------------------------------------------

interface StatementRow {
  id: string;
  text: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  upvotes: number;
}

interface ArgumentRow {
  id: string;
  statement_id: string;
  stance: "for" | "against";
  title: string;
  summary: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  upvotes: number;
}

interface EvidenceRow {
  id: string;
  argument_id: string;
  title: string;
  description: string;
  source_url: string;
  source_type: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

interface UserRow {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  created_at: string;
}

function rowToStatement(row: StatementRow, tags: string[]): Statement {
  return {
    id: row.id,
    text: row.text,
    tags,
    upvotes: row.upvotes,
    userId: row.user_id,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function rowToArgument(row: ArgumentRow): Argument {
  return {
    id: row.id,
    statementId: row.statement_id,
    stance: row.stance,
    title: row.title,
    summary: row.summary,
    upvotes: row.upvotes,
    userId: row.user_id,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

function rowToEvidence(row: EvidenceRow): Evidence {
  return {
    id: row.id,
    argumentId: row.argument_id,
    title: row.title,
    description: row.description,
    sourceUrl: row.source_url,
    sourceType: row.source_type as Evidence["sourceType"],
    userId: row.user_id,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

// Fetch tags for a statement
function getTagsForStatement(statementId: string): string[] {
  const rows = db
    .prepare(
      `SELECT t.label FROM tags t
       JOIN statement_tags st ON st.tag_id = t.id
       WHERE st.statement_id = ?
       ORDER BY t.label`,
    )
    .all(statementId) as { label: string }[];
  return rows.map((r) => r.label);
}

// ---------------------------------------------------------------------------
// Prepared statements (created lazily at module level for reuse)
// ---------------------------------------------------------------------------

const stmtListQuery = db.prepare<[], StatementRow>(`
  SELECT s.*,
    COUNT(v.id) as upvotes
  FROM statements s
  LEFT JOIN votes v ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
  GROUP BY s.id
  ORDER BY s.created_at DESC
`);

const stmtByIdQuery = db.prepare<[string], StatementRow>(`
  SELECT s.*,
    COUNT(v.id) as upvotes
  FROM statements s
  LEFT JOIN votes v ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
  WHERE s.id = ?
  GROUP BY s.id
`);

const argsByStmtQuery = db.prepare<[string], ArgumentRow>(`
  SELECT a.*,
    COUNT(v.id) as upvotes
  FROM arguments a
  LEFT JOIN votes v ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
  WHERE a.statement_id = ?
  GROUP BY a.id
  ORDER BY a.created_at DESC
`);

const argByIdQuery = db.prepare<[string], ArgumentRow>(`
  SELECT a.*,
    COUNT(v.id) as upvotes
  FROM arguments a
  LEFT JOIN votes v ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
  WHERE a.id = ?
  GROUP BY a.id
`);

const evByArgQuery = db.prepare<[string], EvidenceRow>(`
  SELECT e.*
  FROM evidence e
  WHERE e.argument_id = ?
  ORDER BY e.created_at DESC
`);

const userByIdQuery = db.prepare<[string], UserRow>(
  "SELECT * FROM users WHERE id = ?",
);

const allTagsQuery = db.prepare<[], { label: string }>(
  "SELECT DISTINCT label FROM tags ORDER BY label",
);

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------

export function getStatements(): Statement[] {
  const rows = stmtListQuery.all();
  return rows.map((row) => rowToStatement(row, getTagsForStatement(row.id)));
}

export function getStatementById(id: string): Statement | undefined {
  const row = stmtByIdQuery.get(id);
  if (!row) return undefined;
  return rowToStatement(row, getTagsForStatement(id));
}

export function getArgumentsByStatementId(statementId: string): Argument[] {
  return argsByStmtQuery.all(statementId).map(rowToArgument);
}

export function getArgumentById(id: string): Argument | undefined {
  const row = argByIdQuery.get(id);
  return row ? rowToArgument(row) : undefined;
}

export function getEvidenceByArgumentId(argumentId: string): Evidence[] {
  return evByArgQuery.all(argumentId).map(rowToEvidence);
}

export function getStatementForArgument(
  argumentId: string,
): Statement | undefined {
  const arg = getArgumentById(argumentId);
  if (!arg) return undefined;
  return getStatementById(arg.statementId);
}

export function getUserById(id: string): User | undefined {
  const row = userByIdQuery.get(id);
  if (!row) return undefined;
  return { id: row.id, name: row.name, username: row.username };
}

export function getUserByUsername(
  username: string,
): (User & { passwordHash: string }) | undefined {
  const row = db
    .prepare<[string], UserRow>("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    passwordHash: row.password_hash,
  };
}

export function createUser(
  id: string,
  name: string,
  username: string,
  passwordHash: string,
): void {
  db.prepare(
    `INSERT INTO users (id, name, username, password_hash, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
  ).run(id, name, username, passwordHash);
}

export function getAllTags(): string[] {
  return allTagsQuery.all().map((r) => r.label);
}

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------

const insertStatement = db.prepare(
  "INSERT INTO statements (id, text, user_id, created_at) VALUES (?, ?, ?, ?)",
);
const upsertTag = db.prepare("INSERT OR IGNORE INTO tags (label) VALUES (?)");
const tagIdFor = db.prepare<[string], { id: number }>(
  "SELECT id FROM tags WHERE label = ?",
);
const insertStmtTag = db.prepare(
  "INSERT OR IGNORE INTO statement_tags (statement_id, tag_id) VALUES (?, ?)",
);

export function addStatement(statement: Statement): void {
  const run = db.transaction(() => {
    insertStatement.run(
      statement.id,
      statement.text,
      statement.userId,
      statement.createdAt,
    );
    for (const tag of statement.tags) {
      upsertTag.run(tag);
      const row = tagIdFor.get(tag)!;
      insertStmtTag.run(statement.id, row.id);
    }
  });
  run();
}

export function addArgument(argument: Argument): void {
  db.prepare(`
    INSERT INTO arguments (id, statement_id, stance, title, summary, user_id, created_at)
    VALUES (@id, @statementId, @stance, @title, @summary, @userId, @createdAt)
  `).run(argument);
}

export function addEvidence(ev: Evidence): void {
  db.prepare(`
    INSERT INTO evidence (id, argument_id, title, description, source_url, source_type, user_id, created_at)
    VALUES (@id, @argumentId, @title, @description, @sourceUrl, @sourceType, @userId, @createdAt)
  `).run(ev);
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

type TargetType = "statement" | "argument" | "evidence";
type VoteType = "heart" | "up" | "down";

/**
 * Toggle a vote: inserts if absent, deletes if already present.
 * Returns whether the vote is now active (true) or removed (false).
 */
export function toggleVote(
  userId: string,
  targetType: TargetType,
  targetId: string,
  voteType: VoteType,
): boolean {
  const existing = db
    .prepare(
      `SELECT id FROM votes
       WHERE user_id = ? AND target_type = ? AND target_id = ? AND vote_type = ?`,
    )
    .get(userId, targetType, targetId, voteType);

  if (existing) {
    db.prepare(
      `DELETE FROM votes
       WHERE user_id = ? AND target_type = ? AND target_id = ? AND vote_type = ?`,
    ).run(userId, targetType, targetId, voteType);
    return false;
  } else {
    db.prepare(
      `INSERT INTO votes (target_type, target_id, vote_type, user_id, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
    ).run(targetType, targetId, voteType, userId);
    return true;
  }
}

/** Returns the set of vote types the user has cast on a target. */
export function getUserVotesForTarget(
  userId: string,
  targetType: TargetType,
  targetId: string,
): VoteType[] {
  const rows = db
    .prepare(
      `SELECT vote_type FROM votes
       WHERE user_id = ? AND target_type = ? AND target_id = ?`,
    )
    .all(userId, targetType, targetId) as { vote_type: string }[];
  return rows.map((r) => r.vote_type as VoteType);
}

// ---------------------------------------------------------------------------
// Editors (archive previous version, then update main row)
// ---------------------------------------------------------------------------

interface StatementUpdateRow {
  user_id: string;
  text: string;
}

export function updateStatement(
  id: string,
  userId: string,
  data: { text: string; tags: string[] },
): void {
  const run = db.transaction(() => {
    const row = db
      .prepare<[string], StatementUpdateRow>(
        "SELECT user_id, text FROM statements WHERE id = ?",
      )
      .get(id);
    if (!row) throw new Error("Statement not found.");
    if (row.user_id !== userId) throw new Error("Not authorized.");

    const currentTags = getTagsForStatement(id);
    db.prepare(
      `INSERT INTO statement_versions (id, statement_id, text, tags, created_at, edited_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      crypto.randomUUID(),
      id,
      row.text,
      currentTags.join(","),
      new Date().toISOString(),
      userId,
    );

    db.prepare(
      "UPDATE statements SET text = ?, updated_at = ? WHERE id = ?",
    ).run(data.text, new Date().toISOString(), id);

    db.prepare("DELETE FROM statement_tags WHERE statement_id = ?").run(id);
    for (const tag of data.tags) {
      upsertTag.run(tag);
      const tagRow = tagIdFor.get(tag)!;
      insertStmtTag.run(id, tagRow.id);
    }
  });
  run();
}

interface ArgumentUpdateRow {
  user_id: string;
  title: string;
  summary: string;
}

export function updateArgument(
  id: string,
  userId: string,
  data: { title: string; summary: string },
): void {
  const run = db.transaction(() => {
    const row = db
      .prepare<[string], ArgumentUpdateRow>(
        "SELECT user_id, title, summary FROM arguments WHERE id = ?",
      )
      .get(id);
    if (!row) throw new Error("Argument not found.");
    if (row.user_id !== userId) throw new Error("Not authorized.");

    db.prepare(
      `INSERT INTO argument_versions (id, argument_id, title, summary, created_at, edited_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      crypto.randomUUID(),
      id,
      row.title,
      row.summary,
      new Date().toISOString(),
      userId,
    );

    db.prepare(
      "UPDATE arguments SET title = ?, summary = ?, updated_at = ? WHERE id = ?",
    ).run(data.title, data.summary, new Date().toISOString(), id);
  });
  run();
}

interface EvidenceUpdateRow {
  user_id: string;
  title: string;
  description: string;
  source_url: string;
  source_type: string;
}

export function updateEvidence(
  id: string,
  userId: string,
  data: {
    title: string;
    description: string;
    sourceUrl: string;
    sourceType: Evidence["sourceType"];
  },
): void {
  const run = db.transaction(() => {
    const row = db
      .prepare<[string], EvidenceUpdateRow>(
        "SELECT user_id, title, description, source_url, source_type FROM evidence WHERE id = ?",
      )
      .get(id);
    if (!row) throw new Error("Evidence not found.");
    if (row.user_id !== userId) throw new Error("Not authorized.");

    db.prepare(
      `INSERT INTO evidence_versions (id, evidence_id, title, description, source_url, source_type, created_at, edited_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      crypto.randomUUID(),
      id,
      row.title,
      row.description,
      row.source_url,
      row.source_type,
      new Date().toISOString(),
      userId,
    );

    db.prepare(
      "UPDATE evidence SET title = ?, description = ?, source_url = ?, source_type = ?, updated_at = ? WHERE id = ?",
    ).run(
      data.title,
      data.description,
      data.sourceUrl,
      data.sourceType,
      new Date().toISOString(),
      id,
    );
  });
  run();
}

