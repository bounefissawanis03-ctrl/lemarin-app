const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database file location
const fs = require('fs');
const defaultDbPath = path.resolve(__dirname, '../../database/lemarin.db');
const dbPath = process.env.DATABASE_PATH
  ? path.isAbsolute(process.env.DATABASE_PATH)
    ? process.env.DATABASE_PATH
    : path.resolve(__dirname, '../../', process.env.DATABASE_PATH)
  : defaultDbPath;

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite DB:', err);
  } else {
    console.log('Connected to SQLite DB at', dbPath);
    initializeSchema();
  }
});

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function hasColumn(table, column) {
  const cols = await all(`PRAGMA table_info(${table})`);
  return cols.some(col => col.name === column);
}

async function ensureColumn(table, column, definition) {
  if (!(await hasColumn(table, column))) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

async function initializeSchema() {
  // Reservations table
  await run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    roomType TEXT,
    checkIn DATE,
    checkOut DATE,
    guests INTEGER,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admins table
  await run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Reviews table
  await run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservationId INTEGER,
    prenom TEXT,
    nom TEXT,
    ville TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    approved INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservationId) REFERENCES reservations(id) ON DELETE SET NULL
  )`);

  // Services table (static data, but we keep for extensibility)
  await run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT
  )`);

  await ensureColumn('reservations', 'status', "TEXT NOT NULL DEFAULT 'pending'");
  await ensureColumn('reviews', 'prenom', 'TEXT');
  await ensureColumn('reviews', 'nom', 'TEXT');
  await ensureColumn('reviews', 'ville', 'TEXT');
  await ensureColumn('reviews', 'approved', 'INTEGER NOT NULL DEFAULT 0');

  // Insert default services if empty
  const count = await get('SELECT COUNT(*) as cnt FROM services');
  if (count.cnt === 0) {
    const services = [
      ['Vue Mer', 'Sea view rooms', '🌊'],
      ['Parking', 'Secure parking space', '🚗'],
      ['Bains', 'Heated baths', '🛁'],
      ['Climatisation', 'Air conditioning', '❄️'],
      ['Television', 'Flat‑screen TV', '📺'],
      ['Wi‑Fi gratuit', 'Free high‑speed internet', '📶'],
      ['Petit déjeuner', 'Complimentary breakfast', '🥐'],
      ['Cafétéria', 'On‑site café', '☕'],
      ['Beaux balcons', 'Spacious balconies', '🏞️']
    ];
    for (const [name, desc, icon] of services) {
      await run('INSERT INTO services (name, description, icon) VALUES (?,?,?)', [name, desc, icon]);
    }
  }
}

module.exports = { db, run, all, get };
