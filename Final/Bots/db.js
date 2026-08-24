// db.js
// SQLite database management for Jharkhand Tourism user accounts and sessions.
// Uses Node.js built-in node:sqlite with bcryptjs for secure password hashing.

import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "users.db");
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency and foreign keys
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
`);

const BCRYPT_SALT_ROUNDS = 10;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Register a new user in the database with a hashed password
 */
export async function createUser({ name, email, password }) {
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanName) {
    throw new Error("Name is required");
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("A valid email address is required");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check existing user
  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    const err = new Error("An account with this email already exists");
    err.code = "SQLITE_CONSTRAINT_UNIQUE";
    throw err;
  }

  const password_hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const stmt = db.prepare(`
    INSERT INTO users (name, email, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, datetime('now'), datetime('now'))
  `);

  const result = stmt.run(cleanName, cleanEmail, password_hash);
  const userId = Number(result.lastInsertRowid);

  return {
    id: userId,
    name: cleanName,
    email: cleanEmail,
  };
}

/**
 * Find user by email or username/name
 */
export function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim();
  const cleanLower = clean.toLowerCase();
  const stmt = db.prepare(`
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE email = ? COLLATE NOCASE OR name = ? COLLATE NOCASE
  `);
  return stmt.get(cleanLower, clean) || null;
}

/**
 * Find user by email
 */
export function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const stmt = db.prepare(`
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE email = ? COLLATE NOCASE
  `);
  return stmt.get(cleanEmail) || null;
}

/**
 * Find user by ID
 */
export function findUserById(id) {
  if (!id) return null;
  const stmt = db.prepare(`
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = ?
  `);
  return stmt.get(id) || null;
}

/**
 * Verify user password during login (accepts email or username)
 */
export async function verifyUserPassword(identifier, password) {
  const user = findUserByIdentifier(identifier);
  if (!user) {
    return { ok: false, error: "No account matches that username/email and password." };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return { ok: false, error: "No account matches that username/email and password." };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

/**
 * Create an authenticated session for a user
 */
export function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  const stmt = db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, datetime('now'), ?)
  `);
  stmt.run(token, userId, expiresAt);

  return { token, expiresAt };
}

/**
 * Retrieve user associated with an active session token
 */
export function getSessionUser(token) {
  if (!token) return null;

  const stmt = db.prepare(`
    SELECT s.token, s.expires_at, u.id, u.name, u.email, u.created_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
  `);

  const row = stmt.get(token);
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

/**
 * Delete / invalidate session
 */
export function deleteSession(token) {
  if (!token) return;
  const stmt = db.prepare(`DELETE FROM sessions WHERE token = ?`);
  stmt.run(token);
}

/**
 * Clean up expired sessions periodically
 */
export function purgeExpiredSessions() {
  const stmt = db.prepare(`DELETE FROM sessions WHERE datetime(expires_at) <= datetime('now')`);
  stmt.run();
}

/**
 * Count total registered users
 */
export function getUserCount() {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM users`);
  const row = stmt.get();
  return row ? row.count : 0;
}

export default db;
