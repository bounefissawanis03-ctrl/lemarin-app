// src/server/index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.set({
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  next();
});
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
