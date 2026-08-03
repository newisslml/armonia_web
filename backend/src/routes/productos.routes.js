const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/productos.controller');

const router = Router();

router.get('/', asyncHandler(ctrl.listar));
router.get('/:slug', asyncHandler(ctrl.detalle));

module.exports = router;
