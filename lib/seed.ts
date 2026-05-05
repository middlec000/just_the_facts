/**
 * Seeds the database with mock data on first run.
 * Safe to call repeatedly — checks whether the users table is empty first.
 */

import { sql } from "./db";
import { scryptSync } from "crypto";
import {
  users as seedUsers,
  statements as seedStatements,
  arguments_ as seedArguments,
  evidence as seedEvidence,
} from "./mock-data";

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function makePasswordHash(password: string): string {
  const salt = "seed-salt-fixed";
  return `${salt}:${hashPassword(password, salt)}`;
}

export async function seedIfEmpty(): Promise<void> {
  const rows = await sql`SELECT COUNT(*)::int AS n FROM users` as { n: number }[];
  if (rows[0].n > 0) return;

  for (const u of seedUsers) {
    await sql`
      INSERT INTO users (id, name, username, password_hash, created_at)
      VALUES (${u.id}, ${u.name}, ${u.username}, ${makePasswordHash("password")}, ${new Date().toISOString()})
      ON CONFLICT DO NOTHING
    `;
  }

  for (const s of seedStatements) {
    await sql`
      INSERT INTO statements (id, text, user_id, created_at)
      VALUES (${s.id}, ${s.text}, ${s.userId}, ${s.createdAt})
      ON CONFLICT DO NOTHING
    `;
    for (const tag of s.tags) {
      await sql`
        WITH upserted AS (
          INSERT INTO tags (label) VALUES (${tag})
          ON CONFLICT (label) DO UPDATE SET label = EXCLUDED.label
          RETURNING id
        )
        INSERT INTO statement_tags (statement_id, tag_id)
        SELECT ${s.id}, id FROM upserted
        ON CONFLICT DO NOTHING
      `;
    }
  }

  for (const a of seedArguments) {
    await sql`
      INSERT INTO arguments (id, statement_id, stance, title, summary, user_id, created_at)
      VALUES (${a.id}, ${a.statementId}, ${a.stance}, ${a.title}, ${a.summary}, ${a.userId}, ${a.createdAt})
      ON CONFLICT DO NOTHING
    `;
  }

  for (const e of seedEvidence) {
    await sql`
      INSERT INTO evidence (id, argument_id, title, description, source_url, source_type, user_id, created_at)
      VALUES (${e.id}, ${e.argumentId}, ${e.title}, ${e.description}, ${e.sourceUrl}, ${e.sourceType}, ${e.userId}, ${e.createdAt})
      ON CONFLICT DO NOTHING
    `;
  }

  console.log("[db] Seeded database from mock data.");
}

