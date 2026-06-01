#!/usr/bin/env node
// create_admin.js
// Usage:
//   node create_admin.js --email admin@example.com --password Secret123
// or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : true;
      out[key] = val;
    }
  }
  return out;
}

(async () => {
  try {
    const args = parseArgs();
    const email = args.email || process.env.ADMIN_EMAIL;
    const password = args.password || process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Usage: node create_admin.js --email admin@example.com --password Secret123');
      process.exit(1);
    }

    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database', 'lemarin.db');
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found at', dbPath);
      process.exit(1);
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      // Ensure admins table exists
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'", (err, row) => {
        if (err) {
          console.error('DB error:', err.message);
          process.exit(1);
        }
        if (!row) {
          console.error("Table 'admins' does not exist. Create the schema first.");
          process.exit(1);
        }

        const stmt = db.prepare('INSERT INTO admins(email, password) VALUES(?, ?)');
        stmt.run(email, hash, function(err) {
          if (err) {
            console.error('Insert error:', err.message);
            process.exit(1);
          }
          console.log('Admin created with id', this.lastID);
          stmt.finalize(() => db.close());
        });
      });
    });
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
})();
