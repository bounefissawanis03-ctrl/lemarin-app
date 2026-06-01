// src/server/routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../db');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES = '2h';

// Register a new admin (could be disabled in production)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run('INSERT INTO admins (email, passwordHash) VALUES (?,?)', [email, passwordHash]);
    const token = jwt.sign({ id: result.lastID, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin registration failed' });
  }
});

// Login - returns JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await get('SELECT * FROM admins WHERE email = ?', [email]);
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get list of admins (protected)
router.get('/', auth.verifyToken, async (req, res) => {
  try {
    const rows = await all('SELECT id, email, createdAt FROM admins ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

module.exports = router;
