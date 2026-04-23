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
  hearts: number;
}

interface ArgumentRow {
  id: string;
  statement_id: string;
  stance: "for" | "against";
  title: string;
  summary: string;
  user_id: string;
  created_at: string;
  hearts: number;
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
  upvotes: number;
  downvotes: number;
}

interface UserRow {
  id: string;
  name: string;
  created_at: string;
}

function rowToStatement(row: StatementRow, tags: string[]): Statement {
  return {
    id: row.id,
    text: row.text,
    tags,
    hearts: row.hearts,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

function rowToArgument(row: ArgumentRow): Argument {
  return {
    id: row.id,
    statementId: row.statement_id,
    stance: row.stance,
    title: row.title,
    summary: row.summary,
    hearts: row.hearts,
    userId: row.user_id,
    createdAt: row.created_at,
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
    upvotes: row.upvotes,
    downvotes: row.downvotes,
    userId: row.user_id,
    createdAt: row.created_at,
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
    COUNT(v.id) as hearts
  FROM statements s
  LEFT JOIN votes v ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
  GROUP BY s.id
  ORDER BY s.created_at DESC
`);

const stmtByIdQuery = db.prepare<[string], StatementRow>(`
  SELECT s.*,
    COUNT(v.id) as hearts
  FROM statements s
  LEFT JOIN votes v ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
  WHERE s.id = ?
  GROUP BY s.id
`);

const argsByStmtQuery = db.prepare<[string], ArgumentRow>(`
  SELECT a.*,
    COUNT(v.id) as hearts
  FROM arguments a
  LEFT JOIN votes v ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
  WHERE a.statement_id = ?
  GROUP BY a.id
  ORDER BY a.created_at DESC
`);

const argByIdQuery = db.prepare<[string], ArgumentRow>(`
  SELECT a.*,
    COUNT(v.id) as hearts
  FROM arguments a
  LEFT JOIN votes v ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
  WHERE a.id = ?
  GROUP BY a.id
`);

const evByArgQuery = db.prepare<[string], EvidenceRow>(`
  SELECT e.*,
    COUNT(CASE WHEN v.vote_type = 'up'   THEN 1 END) as upvotes,
    COUNT(CASE WHEN v.vote_type = 'down' THEN 1 END) as downvotes
  FROM evidence e
  LEFT JOIN votes v ON v.target_type = 'evidence' AND v.target_id = e.id
  WHERE e.argument_id = ?
  GROUP BY e.id
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
  return { id: row.id, name: row.name };
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

