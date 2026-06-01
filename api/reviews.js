const { readDB, writeDB } = require('./dataStore');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const db = await readDB();
      const reviews = Array.isArray(db.reviews) ? db.reviews : [];
      return res.status(200).json({ reviews: reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    } catch (err) {
      console.error('Reviews GET error:', err);
      return res.status(500).json({ error: 'Unable to fetch reviews' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { prenom, nom, ville, rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Une note entre 1 et 5 est requise.' });
      }
      if (!comment || comment.trim().length < 5) {
        return res.status(400).json({ error: 'Le commentaire est trop court.' });
      }

      const db = await readDB();
      const reviews = Array.isArray(db.reviews) ? db.reviews : [];
      const newReview = {
        id: `rev-${Date.now()}`,
        prenom: prenom || 'Anonyme',
        nom: nom || '',
        ville: ville || '',
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };
      reviews.unshift(newReview);
      await writeDB({ ...db, reviews });
      return res.status(201).json({ message: 'Avis ajouté avec succès', review: newReview });
    } catch (err) {
      console.error('Reviews POST error:', err);
      return res.status(500).json({ error: 'Impossible d’ajouter l’avis.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method not allowed' });
};
