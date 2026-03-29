/**
 * JSON-file-backed data store.
 * On first run the data files are seeded from mock-data.ts.
 * All read helpers mirror the API of mock-data.ts so pages need only
 * change their import path.
 */

import fs from "fs";
import path from "path";
import type { Statement, Argument, Evidence, User } from "./types";
import {
  statements as seedStatements,
  arguments_ as seedArguments,
  evidence as seedEvidence,
  users as seedUsers,
} from "./mock-data";

// ---------------------------------------------------------------------------
// File system helpers
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string, seed: T[]): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
    return structuredClone(seed);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
}

function writeJSON<T>(filename: string, data: T[]) {
  ensureDataDir();
  fs.writeFileSync(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
  );
}

// ---------------------------------------------------------------------------
// Readers  (call fs every time — no in-memory caching so data is always fresh)
// ---------------------------------------------------------------------------

/** Users are static for now (no auth). */
export const users: User[] = seedUsers;

export function getStatements(): Statement[] {
  return readJSON("statements.json", seedStatements);
}

export function getArguments(): Argument[] {
  return readJSON("arguments.json", seedArguments);
}

export function getEvidence(): Evidence[] {
  return readJSON("evidence.json", seedEvidence);
}

export function getStatementById(id: string): Statement | undefined {
  return getStatements().find((s) => s.id === id);
}

export function getArgumentsByStatementId(statementId: string): Argument[] {
  return getArguments().filter((a) => a.statementId === statementId);
}

export function getArgumentById(id: string): Argument | undefined {
  return getArguments().find((a) => a.id === id);
}

export function getEvidenceByArgumentId(argumentId: string): Evidence[] {
  return getEvidence().filter((e) => e.argumentId === argumentId);
}

export function getStatementForArgument(
  argumentId: string,
): Statement | undefined {
  const arg = getArgumentById(argumentId);
  if (!arg) return undefined;
  return getStatementById(arg.statementId);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/** Returns every unique tag used across all statements, sorted alphabetically. */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getStatements().forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------

export function addStatement(statement: Statement) {
  const list = getStatements();
  list.unshift(statement); // newest first
  writeJSON("statements.json", list);
}

export function addArgument(argument: Argument) {
  const list = getArguments();
  list.unshift(argument);
  writeJSON("arguments.json", list);
}

export function addEvidence(ev: Evidence) {
  const list = getEvidence();
  list.unshift(ev);
  writeJSON("evidence.json", list);
}
