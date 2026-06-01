// src/server/index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve the main website from the project root
app.use(express.static(path.join(__dirname, '../..')));
// Also serve public/ for any assets stored there
app.use('/public', express.static(path.join(__dirname, '../../public')));

// Routes
const reservationsRouter = require('./routes/reservations');
const adminsRouter = require('./routes/admin');
const reviewsRouter = require('./routes/reviews');
const servicesRouter = require('./routes/services');

app.use('/api/reservations', reservationsRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/services', servicesRouter);

app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
