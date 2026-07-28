const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '7d';

function firmarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { firmarToken, verificarToken };
