const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { auth_requerida } = require('../middleware/auth');
const ctrl = require('../controllers/pedidos.controller');

const router = Router();

router.use(auth_requerida);

router.post('/', asyncHandler(ctrl.crear));
router.get('/', asyncHandler(ctrl.listar));
router.get('/:id', asyncHandler(ctrl.detalle));

module.exports = router;
