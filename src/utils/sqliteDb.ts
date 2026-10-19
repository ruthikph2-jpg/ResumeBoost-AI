import initSqlJs, { Database } from 'sql.js';

let dbInstance: Database | null = null;
const DB_STORAGE_KEY = 'resumeboost_sqlite_db';
const AUTH_SESSION_KEY = 'resumeboost_auth_session';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  auth_provider: 'google' | 'email' | 'guest';
  created_at: string;
}

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
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        avatar_url TEXT,
        auth_provider TEXT DEFAULT 'email',
        created_at TEXT
      );

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

    // Insert sample user if empty
    const checkUserCount = dbInstance.exec("SELECT COUNT(*) FROM users");
    const userCount = checkUserCount[0]?.values[0]?.[0] as number;
    if (userCount === 0) {
      dbInstance.run(`
        INSERT INTO users (name, email, password_hash, auth_provider, created_at)
        VALUES ('Ruthik ph', 'ruthik@example.com', 'admin123', 'email', datetime('now', 'localtime'));
      `);
    }

    // Insert sample scan records if table is empty
    const checkCount = dbInstance.exec("SELECT COUNT(*) FROM scan_history");
    const count = checkCount[0]?.values[0]?.[0] as number;
    if (count === 0) {
      dbInstance.run(`
        INSERT INTO scan_history (candidate_name, target_role, ats_score, match_score, summary, created_at)
        VALUES 
          ('Ruthik ph', 'Java & Spring Boot Developer', 88, 92, 'Strong candidate profile with high action-verb density and microservices experience.', datetime('now', '-2 hours')),
          ('Alex Doe', 'Software Development Engineer', 64, 70, 'Solid foundations in Java, but lacks quantifiable performance impact metrics.', datetime('now', '-1 day'));
      `);
    }
    
    persistDatabase();
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

/* ========================================================
   AUTHENTICATION & USER OPERATIONS IN SQLITE
======================================================== */

/**
 * Registers a new user account in SQLite.
 */
export async function registerUserInDb(name: string, email: string, password: string): Promise<User> {
  const db = await getDatabase();
  const cleanEmail = email.trim().toLowerCase();
  
  // Check if email already exists
  const checkStmt = db.prepare("SELECT id FROM users WHERE email = ?");
  checkStmt.bind([cleanEmail]);
  if (checkStmt.step()) {
    checkStmt.free();
    throw new Error('An account with this email already exists in SQLite database.');
  }
  checkStmt.free();

  const insertStmt = db.prepare(`
    INSERT INTO users (name, email, password_hash, auth_provider, created_at)
    VALUES (?, ?, ?, 'email', datetime('now', 'localtime'))
  `);
  insertStmt.run([name.trim(), cleanEmail, password]);
  insertStmt.free();
  persistDatabase();

  // Get inserted record
  const fetchStmt = db.prepare("SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  fetchStmt.bind([cleanEmail]);
  fetchStmt.step();
  const row = fetchStmt.getAsObject() as any;
  fetchStmt.free();

  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    auth_provider: 'email',
    created_at: row.created_at,
  };

  saveCurrentSession(user);
  return user;
}

/**
 * Logs in a user via email & password against SQLite.
 */
export async function loginUserInDb(email: string, password: string): Promise<User> {
  const db = await getDatabase();
  const cleanEmail = email.trim().toLowerCase();

  const stmt = db.prepare("SELECT id, name, email, password_hash, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  stmt.bind([cleanEmail]);

  if (!stmt.step()) {
    stmt.free();
    throw new Error('No user found with this email.');
  }

  const row = stmt.getAsObject() as any;
  stmt.free();

  if (row.password_hash !== password) {
    throw new Error('Invalid password. Please check your credentials.');
  }

  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    auth_provider: row.auth_provider || 'email',
    created_at: row.created_at,
  };

  saveCurrentSession(user);
  return user;
}

/**
 * Handles Google Sign-In or creates a user record in SQLite.
 */
export async function loginWithGoogleInDb(name: string, email: string, avatarUrl?: string): Promise<User> {
  const db = await getDatabase();
  const cleanEmail = email.trim().toLowerCase();

  const checkStmt = db.prepare("SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  checkStmt.bind([cleanEmail]);

  if (checkStmt.step()) {
    // Existing user
    const row = checkStmt.getAsObject() as any;
    checkStmt.free();

    const user: User = {
      id: row.id,
      name: row.name,
      email: row.email,
      avatar_url: avatarUrl || row.avatar_url,
      auth_provider: 'google',
      created_at: row.created_at,
    };
    saveCurrentSession(user);
    return user;
  }
  checkStmt.free();

  // Create new Google user in SQLite
  const insertStmt = db.prepare(`
    INSERT INTO users (name, email, avatar_url, auth_provider, created_at)
    VALUES (?, ?, ?, 'google', datetime('now', 'localtime'))
  `);
  insertStmt.run([name, cleanEmail, avatarUrl || '']);
  insertStmt.free();
  persistDatabase();

  const fetchStmt = db.prepare("SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  fetchStmt.bind([cleanEmail]);
  fetchStmt.step();
  const row = fetchStmt.getAsObject() as any;
  fetchStmt.free();

  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    auth_provider: 'google',
    created_at: row.created_at,
  };

  saveCurrentSession(user);
  return user;
}

/**
 * Instant guest login for evaluators / recruiters
 */
export function loginAsGuest(): User {
  const guestUser: User = {
    id: 9999,
    name: 'Ruthik ph (Guest Demo)',
    email: 'guest@resumeboost.ai',
    auth_provider: 'guest',
    created_at: new Date().toISOString(),
  };
  saveCurrentSession(guestUser);
  return guestUser;
}

/**
 * Session persistence helpers
 */
export function saveCurrentSession(user: User) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

export function getCurrentSession(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearCurrentSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

/* ========================================================
   SCAN HISTORY & RESUME OPERATIONS
======================================================== */

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
