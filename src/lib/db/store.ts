import fs from "node:fs";
import path from "node:path";
import type { DB } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function emptyDb(): DB {
  return {
    users: [],
    pages: [],
    news: [],
    programs: [],
    labs: [],
    faculty: [],
    documents: [],
    menu: [],
    media: [],
  };
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyDb(), null, 2), "utf-8");
  }
}

/** Reads the whole store fresh from disk. Simple, correct, and fast
 * enough for a content site of this size — avoids any native binary
 * or external database dependency. */
export function readDb(): DB {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return { ...emptyDb(), ...parsed };
  } catch {
    return emptyDb();
  }
}

export function writeDb(db: DB): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function mutateDb<T>(fn: (db: DB) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

export function newId(prefix = ""): string {
  const id = crypto.randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}
