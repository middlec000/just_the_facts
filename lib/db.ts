/**
 * Singleton better-sqlite3 database connection.
 * The DB file lives at <project-root>/just_the_facts.db.
 */

import Database from "better-sqlite3";
import path from "path";
import { applySchema } from "./schema";
import { seedIfEmpty } from "./seed";

const DB_PATH = path.join(process.cwd(), "just_the_facts.db");

// In Next.js dev mode the module is re-evaluated on every hot reload.
// Stash the instance on the global object to keep a single connection.
const globalForDb = globalThis as unknown as { _db?: Database.Database };

function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  // Write-Ahead Logging for concurrent reads during multi-user tunnel testing
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

if (!globalForDb._db) {
  globalForDb._db = openDb();
  applySchema(globalForDb._db);
  seedIfEmpty(globalForDb._db);
}

export const db: Database.Database = globalForDb._db!;
