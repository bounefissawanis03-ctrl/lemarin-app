const { readDB, writeDB } = require('./dataStore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prenom, nom, email, telephone, checkin, checkout, chambre, personnes, demandes } = req.body;
    if (!prenom || !nom || !email || !checkin || !checkout || !chambre) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const db = await readDB();
    const reservations = Array.isArray(db.reservations) ? db.reservations : [];
    const newReservation = {
      id: `res-${Date.now()}`,
      prenom,
      nom,
      email,
      telephone: telephone || '',
      checkin,
      checkout,
      chambre,
      personnes: personnes || '1',
      demandes: demandes || '—',
      statut: 'pending',
      date: new Date().toLocaleDateString('fr-FR'),
      createdAt: new Date().toISOString()
    };

    reservations.unshift(newReservation);
    await writeDB({ ...db, reservations });
    return res.status(201).json({ message: 'Réservation reçue', id: newReservation.id });
  } catch (err) {
    console.error('Reservations POST error:', err);
    return res.status(500).json({ error: 'Impossible d’enregistrer la réservation.' });
  }
};
