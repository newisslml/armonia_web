const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { asyncHandler } = require('../utils/asyncHandler');
const { auth_requerida } = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

const router = Router();

const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, intenta mas tarde' },
});

router.post('/registro', limitadorAuth, asyncHandler(ctrl.registro));
router.post('/login', limitadorAuth, asyncHandler(ctrl.login));
router.post('/logout', asyncHandler(ctrl.logout));
router.get('/me', auth_requerida, asyncHandler(ctrl.me));

module.exports = router;
