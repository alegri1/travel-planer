import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "travel.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.exec(`
      CREATE TABLE IF NOT EXISTS trips (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        destination TEXT NOT NULL,
        start_date  TEXT NOT NULL,
        end_date    TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS activities (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id    INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        day_index  INTEGER NOT NULL,
        position   INTEGER NOT NULL,
        title      TEXT NOT NULL,
        time       TEXT,
        notes      TEXT,
        metadata   TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // Migrate: add metadata column to existing databases
    try {
      db.exec("ALTER TABLE activities ADD COLUMN metadata TEXT");
    } catch {
      // Column already exists — safe to ignore
    }
  }
  return db;
}
