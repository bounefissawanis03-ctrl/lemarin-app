// src/server/routes/reservations.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Create new reservation (public)
router.post('/', async (req, res) => {
  try {
    const {firstName, lastName, email, phone, roomType, checkIn, checkOut, guests, notes} = req.body;
    const result = await db.run(`INSERT INTO reservations (firstName, lastName, email, phone, roomType, checkIn, checkOut, guests, notes) VALUES (?,?,?,?,?,?,?,?,?)`,
      [firstName, lastName, email, phone, roomType, checkIn, checkOut, guests, notes]
    );
    res.status(201).json({id: result.lastID});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Database error'});
  }
});

// Get all reservations (admin only)
router.get('/', auth.verifyToken, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM reservations ORDER BY createdAt DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Database error'});
  }
});

// Get single reservation (admin only)
router.get('/:id', auth.verifyToken, async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Database error'});
  }
});

// Delete reservation (admin only)
router.delete('/:id', auth.verifyToken, async (req, res) => {
  try {
    await db.run('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({message: 'Reservation deleted'});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Database error'});
  }
});

module.exports = router;
