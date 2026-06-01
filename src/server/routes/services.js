// src/server/routes/services.js
const express = require('express');
const router = express.Router();
const { all } = require('../db');

// Return all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await all('SELECT id, name, description, icon FROM services ORDER BY id');
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
