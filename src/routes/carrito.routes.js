const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { auth_opcional } = require('../middleware/auth');
const ctrl = require('../controllers/carrito.controller');

const router = Router();

router.use(auth_opcional);

router.get('/', asyncHandler(ctrl.ver));
router.post('/items', asyncHandler(ctrl.agregarItem));
router.patch('/items/:id', asyncHandler(ctrl.actualizarItem));
router.delete('/items/:id', asyncHandler(ctrl.eliminarItem));

module.exports = router;
