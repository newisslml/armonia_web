const { randomUUID } = require('crypto');
const { verificarToken } = require('../utils/jwt');
const { ApiError } = require('./errorHandler');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

// Decodifica el JWT si viene, sin exigirlo. Usado por rutas publicas que
// cambian de comportamiento si hay sesion (ej. carrito de invitado vs usuario).
function auth_opcional(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      req.usuario = verificarToken(token);
    } catch {
      res.clearCookie('token', COOKIE_OPTS);
    }
  }
  if (!req.usuario && !req.cookies.guest_id) {
    res.cookie('guest_id', randomUUID(), { ...COOKIE_OPTS, maxAge: 1000 * 60 * 60 * 24 * 30 });
  }
  next();
}

function auth_requerida(req, res, next) {
  const token = req.cookies.token;
  if (!token) throw new ApiError(401, 'No autenticado');
  try {
    req.usuario = verificarToken(token);
  } catch {
    throw new ApiError(401, 'Sesion invalida');
  }
  next();
}

function requerir_admin(req, res, next) {
  if (req.usuario?.rol !== 'admin') throw new ApiError(403, 'Requiere permisos de administrador');
  next();
}

module.exports = { auth_opcional, auth_requerida, requerir_admin, COOKIE_OPTS };
