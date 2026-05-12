/**
 * Neon-backed data store.
 * All functions are async; callers must await them.
 */

import { sql } from "./db";
import type { Statement, Argument, Evidence, User, Review, ReviewStatus } from "./types";

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
    upvotes: Number(row.upvotes),
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
    upvotes: Number(row.upvotes),
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

async function getTagsForStatement(statementId: string): Promise<string[]> {
  const rows = await sql`
    SELECT t.label FROM tags t
    JOIN statement_tags st ON st.tag_id = t.id
    WHERE st.statement_id = ${statementId}
    ORDER BY t.label
  ` as { label: string }[];
  return rows.map((r) => r.label);
}

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------

export async function getStatements(): Promise<Statement[]> {
  const rows = await sql`
    SELECT s.*, COUNT(v.id)::int AS upvotes
    FROM statements s
    LEFT JOIN votes v
      ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
    GROUP BY s.id
    ORDER BY s.created_at DESC
  ` as StatementRow[];
  return Promise.all(
    rows.map((row) =>
      getTagsForStatement(row.id).then((tags) => rowToStatement(row, tags)),
    ),
  );
}

export async function getStatementById(id: string): Promise<Statement | undefined> {
  const rows = await sql`
    SELECT s.*, COUNT(v.id)::int AS upvotes
    FROM statements s
    LEFT JOIN votes v
      ON v.target_type = 'statement' AND v.target_id = s.id AND v.vote_type = 'heart'
    WHERE s.id = ${id}
    GROUP BY s.id
  ` as StatementRow[];
  const row = rows[0];
  if (!row) return undefined;
  return rowToStatement(row, await getTagsForStatement(id));
}

export async function getArgumentsByStatementId(statementId: string): Promise<Argument[]> {
  const rows = await sql`
    SELECT a.*, COUNT(v.id)::int AS upvotes
    FROM arguments a
    LEFT JOIN votes v
      ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
    WHERE a.statement_id = ${statementId}
    GROUP BY a.id
    ORDER BY a.created_at DESC
  ` as ArgumentRow[];
  return rows.map(rowToArgument);
}

export async function getArgumentById(id: string): Promise<Argument | undefined> {
  const rows = await sql`
    SELECT a.*, COUNT(v.id)::int AS upvotes
    FROM arguments a
    LEFT JOIN votes v
      ON v.target_type = 'argument' AND v.target_id = a.id AND v.vote_type = 'heart'
    WHERE a.id = ${id}
    GROUP BY a.id
  ` as ArgumentRow[];
  const row = rows[0];
  return row ? rowToArgument(row) : undefined;
}

export async function getEvidenceByArgumentId(argumentId: string): Promise<Evidence[]> {
  const rows = await sql`
    SELECT e.*
    FROM evidence e
    WHERE e.argument_id = ${argumentId}
    ORDER BY e.created_at DESC
  ` as EvidenceRow[];
  return rows.map(rowToEvidence);
}

export async function getStatementForArgument(argumentId: string): Promise<Statement | undefined> {
  const arg = await getArgumentById(argumentId);
  if (!arg) return undefined;
  return getStatementById(arg.statementId);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const rows = await sql`SELECT * FROM users WHERE id = ${id}` as UserRow[];
  const row = rows[0];
  if (!row) return undefined;
  return { id: row.id, name: row.name, username: row.username };
}

export async function getUserByUsername(
  username: string,
): Promise<(User & { passwordHash: string }) | undefined> {
  const rows = await sql`SELECT * FROM users WHERE username = ${username}` as UserRow[];
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    passwordHash: row.password_hash,
  };
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

interface ReviewRow {
  id: number;
  statement_id: string;
  reviewer_id: string;
  reviewer_name: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string | null;
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    statementId: row.statement_id,
    reviewerId: row.reviewer_id,
    reviewerName: row.reviewer_name,
    status: row.status,
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

export async function getReviewForStatement(statementId: string): Promise<Review | null> {
  const rows = await sql`
    SELECT r.*, u.name AS reviewer_name
    FROM reviews r
    JOIN users u ON u.id = r.reviewer_id
    WHERE r.statement_id = ${statementId}
    ORDER BY COALESCE(r.updated_at, r.created_at) DESC
    LIMIT 1
  ` as ReviewRow[];
  return rows[0] ? rowToReview(rows[0]) : null;
}

export async function getReviewByUserForStatement(
  statementId: string,
  userId: string,
): Promise<Review | null> {
  const rows = await sql`
    SELECT r.*, u.name AS reviewer_name
    FROM reviews r
    JOIN users u ON u.id = r.reviewer_id
    WHERE r.statement_id = ${statementId} AND r.reviewer_id = ${userId}
  ` as ReviewRow[];
  return rows[0] ? rowToReview(rows[0]) : null;
}

export async function upsertReview(
  reviewerId: string,
  statementId: string,
  status: ReviewStatus,
): Promise<void> {
  const now = new Date().toISOString();
  await sql`
    INSERT INTO reviews (statement_id, reviewer_id, status, created_at)
    VALUES (${statementId}, ${reviewerId}, ${status}, ${now})
    ON CONFLICT (statement_id, reviewer_id)
    DO UPDATE SET status = EXCLUDED.status, updated_at = ${now}
  `;
}

export async function createUser(
  id: string,
  name: string,
  username: string,
  passwordHash: string,
): Promise<void> {
  await sql`
    INSERT INTO users (id, name, username, password_hash, created_at)
    VALUES (${id}, ${name}, ${username}, ${passwordHash}, ${new Date().toISOString()})
  `;
}

export async function getAllTags(): Promise<string[]> {
  const rows = await sql`SELECT DISTINCT label FROM tags ORDER BY label` as { label: string }[];
  return rows.map((r) => r.label);
}

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------

export async function addStatement(statement: Statement): Promise<void> {
  await sql`
    INSERT INTO statements (id, text, user_id, created_at)
    VALUES (${statement.id}, ${statement.text}, ${statement.userId}, ${statement.createdAt})
  `;
  for (const tag of statement.tags) {
    // Upsert tag and link to statement in one CTE
    await sql`
      WITH upserted AS (
        INSERT INTO tags (label) VALUES (${tag})
        ON CONFLICT (label) DO UPDATE SET label = EXCLUDED.label
        RETURNING id
      )
      INSERT INTO statement_tags (statement_id, tag_id)
      SELECT ${statement.id}, id FROM upserted
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function addArgument(argument: Argument): Promise<void> {
  await sql`
    INSERT INTO arguments (id, statement_id, stance, title, summary, user_id, created_at)
    VALUES (
      ${argument.id}, ${argument.statementId}, ${argument.stance},
      ${argument.title}, ${argument.summary}, ${argument.userId}, ${argument.createdAt}
    )
  `;
}

export async function addEvidence(ev: Evidence): Promise<void> {
  await sql`
    INSERT INTO evidence (id, argument_id, title, description, source_url, source_type, user_id, created_at)
    VALUES (
      ${ev.id}, ${ev.argumentId}, ${ev.title}, ${ev.description},
      ${ev.sourceUrl}, ${ev.sourceType}, ${ev.userId}, ${ev.createdAt}
    )
  `;
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

type TargetType = "statement" | "argument" | "evidence";
type VoteType = "heart" | "up" | "down";

export async function toggleVote(
  userId: string,
  targetType: TargetType,
  targetId: string,
  voteType: VoteType,
): Promise<boolean> {
  const existing = await sql`
    SELECT id FROM votes
    WHERE user_id = ${userId} AND target_type = ${targetType}
      AND target_id = ${targetId} AND vote_type = ${voteType}
  `;
  if (existing.length > 0) {
    await sql`
      DELETE FROM votes
      WHERE user_id = ${userId} AND target_type = ${targetType}
        AND target_id = ${targetId} AND vote_type = ${voteType}
    `;
    return false;
  } else {
    await sql`
      INSERT INTO votes (target_type, target_id, vote_type, user_id, created_at)
      VALUES (${targetType}, ${targetId}, ${voteType}, ${userId}, ${new Date().toISOString()})
    `;
    return true;
  }
}

export async function getUserVotesForTarget(
  userId: string,
  targetType: TargetType,
  targetId: string,
): Promise<VoteType[]> {
  const rows = await sql`
    SELECT vote_type FROM votes
    WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
  ` as { vote_type: string }[];
  return rows.map((r) => r.vote_type as VoteType);
}

// ---------------------------------------------------------------------------
// Editors (archive previous version, then update main row)
// ---------------------------------------------------------------------------

export async function updateStatement(
  id: string,
  userId: string,
  data: { text: string; tags: string[] },
): Promise<void> {
  const rows = await sql`
    SELECT user_id, text FROM statements WHERE id = ${id}
  ` as { user_id: string; text: string }[];
  const row = rows[0];
  if (!row) throw new Error("Statement not found.");
  if (row.user_id !== userId) throw new Error("Not authorized.");

  const currentTags = await getTagsForStatement(id);

  await sql`
    INSERT INTO statement_versions (id, statement_id, text, tags, created_at, edited_by)
    VALUES (
      ${crypto.randomUUID()}, ${id}, ${row.text},
      ${currentTags.join(",")}, ${new Date().toISOString()}, ${userId}
    )
  `;
  await sql`
    UPDATE statements SET text = ${data.text}, updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `;
  await sql`DELETE FROM statement_tags WHERE statement_id = ${id}`;
  for (const tag of data.tags) {
    await sql`
      WITH upserted AS (
        INSERT INTO tags (label) VALUES (${tag})
        ON CONFLICT (label) DO UPDATE SET label = EXCLUDED.label
        RETURNING id
      )
      INSERT INTO statement_tags (statement_id, tag_id)
      SELECT ${id}, id FROM upserted
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function updateArgument(
  id: string,
  userId: string,
  data: { title: string; summary: string },
): Promise<void> {
  const rows = await sql`
    SELECT user_id, title, summary FROM arguments WHERE id = ${id}
  ` as { user_id: string; title: string; summary: string }[];
  const row = rows[0];
  if (!row) throw new Error("Argument not found.");
  if (row.user_id !== userId) throw new Error("Not authorized.");

  await sql`
    INSERT INTO argument_versions (id, argument_id, title, summary, created_at, edited_by)
    VALUES (
      ${crypto.randomUUID()}, ${id}, ${row.title},
      ${row.summary}, ${new Date().toISOString()}, ${userId}
    )
  `;
  await sql`
    UPDATE arguments SET title = ${data.title}, summary = ${data.summary},
      updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `;
}

export async function updateEvidence(
  id: string,
  userId: string,
  data: {
    title: string;
    description: string;
    sourceUrl: string;
    sourceType: Evidence["sourceType"];
  },
): Promise<void> {
  const rows = await sql`
    SELECT user_id, title, description, source_url, source_type FROM evidence WHERE id = ${id}
  ` as { user_id: string; title: string; description: string; source_url: string; source_type: string }[];
  const row = rows[0];
  if (!row) throw new Error("Evidence not found.");
  if (row.user_id !== userId) throw new Error("Not authorized.");

  await sql`
    INSERT INTO evidence_versions (id, evidence_id, title, description, source_url, source_type, created_at, edited_by)
    VALUES (
      ${crypto.randomUUID()}, ${id}, ${row.title}, ${row.description},
      ${row.source_url}, ${row.source_type}, ${new Date().toISOString()}, ${userId}
    )
  `;
  await sql`
    UPDATE evidence
    SET title = ${data.title}, description = ${data.description},
        source_url = ${data.sourceUrl}, source_type = ${data.sourceType},
        updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `;
}



