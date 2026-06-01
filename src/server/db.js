const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database file location
const dbPath = path.resolve(__dirname, '../../database/lemarin.db');

// Ensure database directory exists
const fs = require('fs');
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
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
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
