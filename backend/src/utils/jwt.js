const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '7d';

// Unico caller es auth.controller.js, siempre con { id, rol } (ver
// auth.controller.test.js) — sin PII ni datos sensibles en el payload.
function firmarToken(payload) {
  // nosemgrep: javascript.jsonwebtoken.security.audit.jwt-exposed-data.jwt-exposed-data
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { firmarToken, verificarToken };
