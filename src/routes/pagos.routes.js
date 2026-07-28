const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { auth_requerida } = require('../middleware/auth');
const ctrl = require('../controllers/pagos.controller');

const router = Router();

router.post('/webpay/iniciar', auth_requerida, asyncHandler(ctrl.iniciar));
// Retorno de Transbank: el navegador vuelve sin cookies de auth garantizadas,
// por eso no exige sesion; el pago ya quedo ligado al pedido en /iniciar.
router.post('/webpay/confirmar', asyncHandler(ctrl.confirmar));

module.exports = router;
