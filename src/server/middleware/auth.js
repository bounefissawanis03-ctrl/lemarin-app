// src/server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'supersecretkey';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // payload contains admin id and email
    next();
  });
}

module.exports = { verifyToken };
