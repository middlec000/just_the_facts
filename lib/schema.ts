/**
 * Fact-Dim schema for Just The Facts.
 *
 * Dimension tables  – "who/what":  users, tags
 * Fact tables       – artifacts:   statements, arguments, evidence
 * Junction table    – statement_tags  (Statement ↔ Tag, many-to-many)
 * Votes fact table  – votes  (replaces raw hearts/upvotes/downvotes counters)
 */

import type Database from "better-sqlite3";

export function applySchema(db: Database.Database): void {
  db.exec(`
    -- -----------------------------------------------------------------------
    -- Dimension: users
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      username      TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- -----------------------------------------------------------------------
    -- Dimension: tags  (normalised tag strings)
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS tags (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT    NOT NULL UNIQUE
    );

    -- -----------------------------------------------------------------------
    -- Fact: statements
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS statements (
      id         TEXT PRIMARY KEY,
      text       TEXT NOT NULL,
      user_id    TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    );

    -- -----------------------------------------------------------------------
    -- Junction: statement ↔ tag  (many-to-many)
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS statement_tags (
      statement_id TEXT NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      tag_id       INTEGER NOT NULL REFERENCES tags(id)    ON DELETE CASCADE,
      PRIMARY KEY (statement_id, tag_id)
    );

    -- -----------------------------------------------------------------------
    -- Fact: arguments
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS arguments (
      id           TEXT PRIMARY KEY,
      statement_id TEXT NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
      stance       TEXT NOT NULL CHECK(stance IN ('for', 'against')),
      title        TEXT NOT NULL,
      summary      TEXT NOT NULL,
      user_id      TEXT NOT NULL REFERENCES users(id),
      created_at   TEXT NOT NULL
    );

    -- -----------------------------------------------------------------------
    -- Fact: evidence
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS evidence (
      id          TEXT PRIMARY KEY,
      argument_id TEXT NOT NULL REFERENCES arguments(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      source_url  TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL DEFAULT 'other'
                       CHECK(source_type IN ('article','study','official','video','book','other')),
      user_id     TEXT NOT NULL REFERENCES users(id),
      created_at  TEXT NOT NULL
    );

    -- -----------------------------------------------------------------------
    -- Fact: votes  (hearts on statements/arguments; up/down on evidence)
    -- UNIQUE constraint prevents a user voting the same way twice.
    -- -----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS votes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      target_type TEXT NOT NULL CHECK(target_type IN ('statement','argument','evidence')),
      target_id   TEXT NOT NULL,
      vote_type   TEXT NOT NULL CHECK(vote_type IN ('heart','up','down')),
      user_id     TEXT NOT NULL REFERENCES users(id),
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(target_type, target_id, vote_type, user_id)
    );

    -- Indexes for common foreign-key lookups
    CREATE INDEX IF NOT EXISTS idx_arguments_statement_id  ON arguments(statement_id);
    CREATE INDEX IF NOT EXISTS idx_evidence_argument_id    ON evidence(argument_id);
    CREATE INDEX IF NOT EXISTS idx_statement_tags_stmt     ON statement_tags(statement_id);
    CREATE INDEX IF NOT EXISTS idx_votes_target            ON votes(target_type, target_id);
  `);

  // -- Migrations: add auth columns to existing databases ----------------
  // SQLite has no "ADD COLUMN IF NOT EXISTS"; we catch the error instead.
  for (const sql of [
    "ALTER TABLE users ADD COLUMN username TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''",
  ]) {
    try {
      db.exec(sql);
    } catch {
      // column already exists — safe to ignore
    }
  }
}
