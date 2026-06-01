const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = '/tmp/lemarin-vercel-db.json';
const INIT_PATH = path.join(__dirname, '..', 'database', 'init-data.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const initial = await fs.readFile(INIT_PATH, 'utf8');
    await fs.writeFile(DATA_PATH, initial, 'utf8');
  }
}

async function readDB() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(content || '{}');
}

async function writeDB(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readDB, writeDB };
