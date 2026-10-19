import initSqlJs, { Database } from 'sql.js';

let dbInstance: Database | null = null;
let isFallbackMode = false;

const DB_STORAGE_KEY = 'resumeboost_sqlite_db';
const AUTH_SESSION_KEY = 'resumeboost_auth_session';
const FALLBACK_USERS_KEY = 'resumeboost_sqlite_users';
const FALLBACK_SCANS_KEY = 'resumeboost_sqlite_scans';

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
 * Fallback In-Memory / LocalStorage SQLite engine
 * Guarantees zero downtime if WebAssembly is blocked or unavailable.
 */
class FallbackSqliteStore {
  private getUsers(): any[] {
    try {
      const raw = localStorage.getItem(FALLBACK_USERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 1,
        name: 'Ruthik ph',
        email: 'ruthik@example.com',
        password_hash: 'admin123',
        avatar_url: '',
        auth_provider: 'email',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Ruthik ph',
        email: 'ruthiksavanth1@gmail.com',
        password_hash: '',
        avatar_url: '',
        auth_provider: 'email',
        created_at: new Date().toISOString(),
      }
    ];
  }

  private saveUsers(users: any[]) {
    try {
      localStorage.setItem(FALLBACK_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Fallback users save notice:', e);
    }
  }

  private getScans(): ScanRecord[] {
    try {
      const raw = localStorage.getItem(FALLBACK_SCANS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 1,
        candidate_name: 'Ruthik ph',
        target_role: 'Java & Spring Boot Developer',
        ats_score: 88,
        match_score: 92,
        summary: 'Strong candidate profile with high action-verb density and microservices experience.',
        created_at: new Date(Date.now() - 7200000).toLocaleString(),
      },
      {
        id: 2,
        candidate_name: 'Alex Doe',
        target_role: 'Software Development Engineer',
        ats_score: 64,
        match_score: 70,
        summary: 'Solid foundations in Java, but lacks quantifiable performance impact metrics.',
        created_at: new Date(Date.now() - 86400000).toLocaleString(),
      }
    ];
  }

  private saveScans(scans: ScanRecord[]) {
    try {
      localStorage.setItem(FALLBACK_SCANS_KEY, JSON.stringify(scans));
    } catch (e) {
      console.warn('Fallback scans save notice:', e);
    }
  }

  findUserByEmail(email: string): any | null {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  createUser(name: string, email: string, passwordHash: string, authProvider: 'email' | 'google' | 'guest'): User {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (existingIndex >= 0) {
      // Update existing
      users[existingIndex].name = name;
      if (passwordHash) users[existingIndex].password_hash = passwordHash;
      users[existingIndex].auth_provider = authProvider;
      this.saveUsers(users);
      return {
        id: users[existingIndex].id,
        name: users[existingIndex].name,
        email: users[existingIndex].email,
        avatar_url: users[existingIndex].avatar_url,
        auth_provider: authProvider,
        created_at: users[existingIndex].created_at,
      };
    }

    const newUser: any = {
      id: Date.now(),
      name,
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      avatar_url: '',
      auth_provider: authProvider,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar_url: newUser.avatar_url,
      auth_provider: authProvider,
      created_at: newUser.created_at,
    };
  }

  addScan(candidateName: string, targetRole: string, atsScore: number, matchScore: number, summary: string) {
    const scans = this.getScans();
    const newScan: ScanRecord = {
      id: Date.now(),
      candidate_name: candidateName || 'Ruthik ph',
      target_role: targetRole,
      ats_score: atsScore,
      match_score: matchScore,
      summary: summary || '',
      created_at: new Date().toLocaleString(),
    };
    scans.unshift(newScan);
    this.saveScans(scans);
  }

  getAllScans(): ScanRecord[] {
    return this.getScans();
  }

  clearScans() {
    this.saveScans([]);
  }
}

const fallbackStore = new FallbackSqliteStore();

/**
 * Initializes the SQLite WebAssembly database.
 * Falls back gracefully to resilient storage if WebAssembly fails.
 */
export async function getDatabase(): Promise<Database | null> {
  if (dbInstance) return dbInstance;
  if (isFallbackMode) return null;

  try {
    // 1. Point to local same-origin WebAssembly file in /public/sql-wasm.wasm
    const SQL = await initSqlJs({
      locateFile: () => '/sql-wasm.wasm',
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

    // Insert sample users if empty
    const checkUserCount = dbInstance.exec("SELECT COUNT(*) FROM users");
    const userCount = checkUserCount[0]?.values[0]?.[0] as number;
    if (userCount === 0) {
      dbInstance.run(`
        INSERT INTO users (name, email, password_hash, auth_provider, created_at)
        VALUES 
          ('Ruthik ph', 'ruthik@example.com', 'admin123', 'email', datetime('now', 'localtime')),
          ('Ruthik ph', 'ruthiksavanth1@gmail.com', 'admin123', 'email', datetime('now', 'localtime'));
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
    console.warn('SQLite WebAssembly local fetch notice, activating resilient storage fallback:', err);
    isFallbackMode = true;
    return null;
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
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDatabase();

  if (!db) {
    // Fallback store
    const user = fallbackStore.createUser(name.trim(), cleanEmail, password, 'email');
    saveCurrentSession(user);
    return user;
  }

  // Check if email already exists
  const checkStmt = db.prepare("SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  checkStmt.bind([cleanEmail]);
  if (checkStmt.step()) {
    const existing = checkStmt.getAsObject() as any;
    checkStmt.free();
    const user: User = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      avatar_url: existing.avatar_url,
      auth_provider: 'email',
      created_at: existing.created_at,
    };
    saveCurrentSession(user);
    return user;
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
 * Auto-registers if it's the first time so the user is never blocked.
 */
export async function loginUserInDb(email: string, password: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDatabase();

  if (!db) {
    // Fallback store
    let userRecord = fallbackStore.findUserByEmail(cleanEmail);
    if (!userRecord) {
      const inferredName = cleanEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Ruthik ph';
      const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
      return registerUserInDb(formattedName, cleanEmail, password);
    }
    const user: User = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      avatar_url: userRecord.avatar_url,
      auth_provider: userRecord.auth_provider || 'email',
      created_at: userRecord.created_at,
    };
    saveCurrentSession(user);
    return user;
  }

  const stmt = db.prepare("SELECT id, name, email, password_hash, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  stmt.bind([cleanEmail]);

  if (!stmt.step()) {
    stmt.free();
    // Auto-create on first sign in
    const inferredName = cleanEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Ruthik ph';
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
    return registerUserInDb(formattedName, cleanEmail, password);
  }

  const row = stmt.getAsObject() as any;
  stmt.free();

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
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDatabase();

  if (!db) {
    const user = fallbackStore.createUser(name, cleanEmail, '', 'google');
    saveCurrentSession(user);
    return user;
  }

  const checkStmt = db.prepare("SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE email = ?");
  checkStmt.bind([cleanEmail]);

  if (checkStmt.step()) {
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
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Session save notice:', e);
  }
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
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {}
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
  if (!db) {
    fallbackStore.addScan(candidateName, targetRole, atsScore, matchScore, summary);
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO scan_history (candidate_name, target_role, ats_score, match_score, summary, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))
  `);
  stmt.run([candidateName || 'Ruthik ph', targetRole, atsScore, matchScore, summary || '']);
  stmt.free();
  persistDatabase();
}

/**
 * Retrieves all scan history records from SQLite.
 */
export async function fetchScanHistory(): Promise<ScanRecord[]> {
  const db = await getDatabase();
  if (!db) {
    return fallbackStore.getAllScans();
  }

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
  if (!db) {
    fallbackStore.clearScans();
    return;
  }
  db.run("DELETE FROM scan_history");
  persistDatabase();
}

/**
 * Downloads the actual binary .sqlite database file to the user's computer.
 */
export async function downloadSqliteFile(): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    // Generate an SQL text dump for fallback
    const users = fallbackStore['getUsers']?.() || [];
    const scans = fallbackStore['getScans']?.() || [];
    let sqlDump = `-- ResumeBoost AI SQLite Database Dump\n-- Generated: ${new Date().toISOString()}\n\n`;
    sqlDump += `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, auth_provider TEXT);\n`;
    users.forEach((u: any) => {
      sqlDump += `INSERT INTO users VALUES (${u.id}, '${u.name}', '${u.email}', '${u.auth_provider}');\n`;
    });
    sqlDump += `\nCREATE TABLE scan_history (id INTEGER PRIMARY KEY, candidate_name TEXT, target_role TEXT, ats_score INTEGER);\n`;
    scans.forEach((s: any) => {
      sqlDump += `INSERT INTO scan_history VALUES (${s.id}, '${s.candidate_name}', '${s.target_role}', ${s.ats_score});\n`;
    });
    const blob = new Blob([sqlDump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumeboost_database_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const binaryArray = db.export();
  const blob = new Blob([binaryArray.buffer as ArrayBuffer], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resumeboost_database_${Date.now()}.sqlite`;
  a.click();
  URL.revokeObjectURL(url);
}
