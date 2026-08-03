const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/categorias.controller');

const router = Router();

router.get('/', asyncHandler(ctrl.arbol));

module.exports = router;
