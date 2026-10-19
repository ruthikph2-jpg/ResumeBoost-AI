import initSqlJs, { Database } from 'sql.js';

let dbInstance: Database | null = null;
const DB_STORAGE_KEY = 'resumeboost_sqlite_db';

export interface ScanRecord {
  id: number;
  candidate_name: string;
  target_role: string;
  ats_score: number;
  match_score: number;
  summary: string;
  created_at: string;
}

/**
 * Initializes the SQLite WebAssembly database.
 * Restores binary database state from localStorage if available.
 */
export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  try {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
    });

    const savedBinary = localStorage.getItem(DB_STORAGE_KEY);
    if (savedBinary) {
      try {
        const u8Array = new Uint8Array(JSON.parse(savedBinary));
        dbInstance = new SQL.Database(u8Array);
      } catch {
        dbInstance = new SQL.Database();
      }
    } else {
      dbInstance = new SQL.Database();
    }

    // Initialize Tables
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_name TEXT,
        target_role TEXT,
        ats_score INTEGER,
        match_score INTEGER,
        summary TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS saved_resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        updated_at TEXT
      );
    `);

    // Insert sample default records if table is empty
    const checkCount = dbInstance.exec("SELECT COUNT(*) FROM scan_history");
    const count = checkCount[0]?.values[0]?.[0] as number;
    if (count === 0) {
      dbInstance.run(`
        INSERT INTO scan_history (candidate_name, target_role, ats_score, match_score, summary, created_at)
        VALUES 
          ('Ruthik ph', 'Java & Spring Boot Developer', 88, 92, 'Strong candidate profile with high action-verb density and microservices experience.', datetime('now', '-2 hours')),
          ('Alex Doe', 'Software Development Engineer', 64, 70, 'Solid foundations in Java, but lacks quantifiable performance impact metrics.', datetime('now', '-1 day'));
      `);
      persistDatabase();
    }

    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err);
    throw err;
  }
}

/**
 * Persists the binary SQLite state into local storage.
 */
export function persistDatabase() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const arr = Array.from(data);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('Could not persist SQLite to storage', e);
  }
}

/**
 * Inserts a new scan record into SQLite.
 */
export async function saveScanToDb(
  candidateName: string,
  targetRole: string,
  atsScore: number,
  matchScore: number,
  summary: string
): Promise<void> {
  const db = await getDatabase();
  const stmt = db.prepare(`
    INSERT INTO scan_history (candidate_name, target_role, ats_score, match_score, summary, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))
  `);
  stmt.run([candidateName || 'Anonymous', targetRole, atsScore, matchScore, summary || '']);
  stmt.free();
  persistDatabase();
}

/**
 * Retrieves all scan history records from SQLite.
 */
export async function fetchScanHistory(): Promise<ScanRecord[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT id, candidate_name, target_role, ats_score, match_score, summary, created_at FROM scan_history ORDER BY id DESC");
  
  if (!res || res.length === 0) return [];

  const columns = res[0].columns;
  const values = res[0].values;

  return values.map((row) => {
    const record: any = {};
    columns.forEach((col, idx) => {
      record[col] = row[idx];
    });
    return record as ScanRecord;
  });
}

/**
 * Clears scan history from SQLite.
 */
export async function clearScanHistoryDb(): Promise<void> {
  const db = await getDatabase();
  db.run("DELETE FROM scan_history");
  persistDatabase();
}

/**
 * Downloads the actual binary .sqlite database file to the user's computer.
 */
export async function downloadSqliteFile(): Promise<void> {
  const db = await getDatabase();
  const binaryArray = db.export();
  const blob = new Blob([binaryArray.buffer as ArrayBuffer], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resumeboost_database_${Date.now()}.sqlite`;
  a.click();
  URL.revokeObjectURL(url);
}
