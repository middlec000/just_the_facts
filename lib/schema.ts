/**
 * PostgreSQL schema for Just The Facts.
 * Run via `npx tsx scripts/migrate.ts` before the first deployment.
 */

import { sql } from "./db";

export async function applySchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT        PRIMARY KEY,
      name          TEXT        NOT NULL,
      username      TEXT        NOT NULL DEFAULT '',
      password_hash TEXT        NOT NULL DEFAULT '',
      created_at    TEXT        NOT NULL DEFAULT (to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tags (
      id    SERIAL PRIMARY KEY,
      label TEXT   NOT NULL UNIQUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS statements (
      id         TEXT NOT NULL PRIMARY KEY,
      text       TEXT NOT NULL,
      user_id    TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS statement_tags (
      statement_id TEXT    NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      tag_id       INTEGER NOT NULL REFERENCES tags(id)       ON DELETE CASCADE,
      PRIMARY KEY (statement_id, tag_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS arguments (
      id           TEXT NOT NULL PRIMARY KEY,
      statement_id TEXT NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      stance       TEXT NOT NULL CHECK(stance IN ('for', 'against')),
      title        TEXT NOT NULL,
      summary      TEXT NOT NULL,
      user_id      TEXT NOT NULL REFERENCES users(id),
      created_at   TEXT NOT NULL,
      updated_at   TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS evidence (
      id          TEXT NOT NULL PRIMARY KEY,
      argument_id TEXT NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      source_url  TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL DEFAULT 'other'
                  CHECK(source_type IN ('article','study','official','video','book','other')),
      user_id     TEXT NOT NULL REFERENCES users(id),
      created_at  TEXT NOT NULL,
      updated_at  TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id          SERIAL PRIMARY KEY,
      target_type TEXT NOT NULL CHECK(target_type IN ('statement','argument','evidence')),
      target_id   TEXT NOT NULL,
      vote_type   TEXT NOT NULL CHECK(vote_type IN ('heart','up','down')),
      user_id     TEXT NOT NULL REFERENCES users(id),
      created_at  TEXT NOT NULL DEFAULT (to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
      UNIQUE(target_type, target_id, vote_type, user_id)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_arguments_statement_id ON arguments(statement_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_evidence_argument_id   ON evidence(argument_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_statement_tags_stmt    ON statement_tags(statement_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_votes_target           ON votes(target_type, target_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS statement_versions (
      id           TEXT NOT NULL PRIMARY KEY,
      statement_id TEXT NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      text         TEXT NOT NULL,
      tags         TEXT NOT NULL DEFAULT '',
      created_at   TEXT NOT NULL,
      edited_by    TEXT NOT NULL REFERENCES users(id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS argument_versions (
      id          TEXT NOT NULL PRIMARY KEY,
      argument_id TEXT NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      summary     TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      edited_by   TEXT NOT NULL REFERENCES users(id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS evidence_versions (
      id          TEXT NOT NULL PRIMARY KEY,
      evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      source_url  TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL DEFAULT 'other',
      created_at  TEXT NOT NULL,
      edited_by   TEXT NOT NULL REFERENCES users(id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id           SERIAL PRIMARY KEY,
      statement_id TEXT NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      reviewer_id  TEXT NOT NULL REFERENCES users(id),
      status       TEXT NOT NULL CHECK(status IN ('verified', 'not_objective', 'not_falsifiable')),
      created_at   TEXT NOT NULL,
      updated_at   TEXT,
      UNIQUE(statement_id, reviewer_id)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_statement_id ON reviews(statement_id)`;
}

