/**
 * Seeds the database with mock data on first run.
 * Runs inside a transaction; safe to call on every startup because it checks
 * whether the users table is empty before doing anything.
 */

import type Database from "better-sqlite3";
import {
  users as seedUsers,
  statements as seedStatements,
  arguments_ as seedArguments,
  evidence as seedEvidence,
} from "./mock-data";

export function seedIfEmpty(db: Database.Database): void {
  const count = (
    db.prepare("SELECT COUNT(*) as n FROM users").get() as { n: number }
  ).n;

  if (count > 0) return; // already seeded

  const seed = db.transaction(() => {
    // --- users ---
    const insertUser = db.prepare(
      "INSERT OR IGNORE INTO users (id, name, created_at) VALUES (?, ?, datetime('now'))",
    );
    for (const u of seedUsers) {
      insertUser.run(u.id, u.name);
    }

    // --- tags (upsert unique labels) ---
    const upsertTag = db.prepare(
      "INSERT OR IGNORE INTO tags (label) VALUES (?)",
    );
    const tagIdFor = db.prepare("SELECT id FROM tags WHERE label = ?");

    // --- statements + statement_tags ---
    const insertStatement = db.prepare(`
      INSERT OR IGNORE INTO statements (id, text, user_id, created_at)
      VALUES (?, ?, ?, ?)
    `);
    const insertStmtTag = db.prepare(`
      INSERT OR IGNORE INTO statement_tags (statement_id, tag_id) VALUES (?, ?)
    `);
    for (const s of seedStatements) {
      insertStatement.run(s.id, s.text, s.userId, s.createdAt);

      for (const tag of s.tags) {
        upsertTag.run(tag);
        const row = tagIdFor.get(tag) as { id: number };
        insertStmtTag.run(s.id, row.id);
      }
    }

    // --- arguments ---
    const insertArg = db.prepare(`
      INSERT OR IGNORE INTO arguments (id, statement_id, stance, title, summary, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of seedArguments) {
      insertArg.run(
        a.id,
        a.statementId,
        a.stance,
        a.title,
        a.summary,
        a.userId,
        a.createdAt,
      );
    }

    // --- evidence ---
    const insertEv = db.prepare(`
      INSERT OR IGNORE INTO evidence (id, argument_id, title, description, source_url, source_type, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const e of seedEvidence) {
      insertEv.run(
        e.id,
        e.argumentId,
        e.title,
        e.description,
        e.sourceUrl,
        e.sourceType,
        e.userId,
        e.createdAt,
      );
    }
  });

  seed();
  console.log("[db] Seeded database from mock data.");
}
