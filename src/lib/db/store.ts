import fs from "node:fs";
import path from "node:path";
import type { DB } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function emptyDb(): DB {
  return {
    bulletins: [],
    services: [],
    events: [],
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
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.users)) {
    throw new Error("Le fichier de contenu est invalide. Restaurez une sauvegarde.");
  }
  return { ...emptyDb(), ...parsed };
}

export function writeDb(db: DB): void {
  ensureFile();
  const temporary = DATA_FILE + "." + crypto.randomUUID() + ".tmp";
  try {
    fs.writeFileSync(temporary, JSON.stringify(db, null, 2), { encoding: "utf-8", flag: "wx" });
    fs.copyFileSync(DATA_FILE, DATA_FILE + ".previous");
    fs.renameSync(temporary, DATA_FILE);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

export function mutateDb<T>(fn: (db: DB) => T): T {
  ensureFile();
  const lock = DATA_FILE + ".lock";
  // The lock spans the complete read/modify/write operation across Node processes.
  const deadline = Date.now() + 2000;
  let handle: number;
  for (;;) {
    try {
      handle = fs.openSync(lock, "wx");
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (Date.now() >= deadline) throw new Error("Enregistrement occupé. Réessayez dans quelques instants.");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
  try {
    const db = readDb();
    const result = fn(db);
    writeDb(db);
    return result;
  } finally {
    fs.closeSync(handle);
    fs.unlinkSync(lock);
  }
}

export function newId(prefix = ""): string {
  const id = crypto.randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}
