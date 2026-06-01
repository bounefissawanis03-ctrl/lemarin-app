const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { run, all } = require('../db');

// GET approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await all(
      `SELECT id, prenom, nom, ville, rating, comment, approved, createdAt
       FROM reviews WHERE approved = 1 ORDER BY createdAt DESC`
    );
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST a new review (public – anyone can leave a review)
router.post('/', async (req, res) => {
  const { prenom, nom, ville, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Note entre 1 et 5 requise' });
  }
  if (!comment || comment.trim().length < 5) {
    return res.status(400).json({ error: 'Commentaire trop court' });
  }
  try {
    const result = await run(
      'INSERT INTO reviews (prenom, nom, ville, rating, comment, approved) VALUES (?,?,?,?,?,0)',
      [prenom || 'Anonyme', nom || '', ville || '', rating, comment.trim()]
    );
    res.status(201).json({ review: { id: result.lastID, prenom: prenom || 'Anonyme', nom: nom || '', ville: ville || '', rating, comment: comment.trim(), approved: 0 } });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all reviews for admin moderation
router.get('/admin', auth.verifyToken, async (req, res) => {
  try {
    const reviews = await all(
      `SELECT id, prenom, nom, ville, rating, comment, approved, createdAt
       FROM reviews ORDER BY createdAt DESC`
    );
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching admin reviews:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Approve a review (admin only)
router.put('/:id/approve', auth.verifyToken, async (req, res) => {
  try {
    const result = await run('UPDATE reviews SET approved = 1 WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review approved' });
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a review (admin only)
router.delete('/:id', auth.verifyToken, async (req, res) => {
  try {
    const result = await run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
