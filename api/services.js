const { readDB } = require('./dataStore');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const db = await readDB();
    res.status(200).json(db.services || []);
  } catch (err) {
    console.error('Service API error:', err);
    res.status(500).json({ error: 'Unable to load services' });
  }
};
