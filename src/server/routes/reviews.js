const express = require('express');
const router = express.Router();
const { run, all } = require('../db');

// GET all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await all(
      `SELECT id, prenom, ville, rating, comment, createdAt
       FROM reviews ORDER BY createdAt DESC`
    );
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST a new review (public – anyone can leave a review)
router.post('/', async (req, res) => {
  const { prenom, ville, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Note entre 1 et 5 requise' });
  }
  if (!comment || comment.trim().length < 5) {
    return res.status(400).json({ error: 'Commentaire trop court' });
  }
  try {
    await run(
      'INSERT INTO reviews (prenom, ville, rating, comment) VALUES (?,?,?,?)',
      [prenom || 'Anonyme', ville || '', rating, comment.trim()]
    );
    res.status(201).json({ message: 'Avis ajouté avec succès' });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
