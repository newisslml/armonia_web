const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { auth_requerida, requerir_admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/admin.controller');

const router = Router();

router.use(auth_requerida, requerir_admin);

router.post('/productos', asyncHandler(ctrl.crearProducto));
router.put('/productos/:id', asyncHandler(ctrl.actualizarProducto));
router.delete('/productos/:id', asyncHandler(ctrl.eliminarProducto));
router.post('/productos/:id/imagen', upload.single('imagen'), asyncHandler(ctrl.subirImagenProducto));

router.post('/categorias', asyncHandler(ctrl.crearCategoria));
router.put('/categorias/:id', asyncHandler(ctrl.actualizarCategoria));
router.delete('/categorias/:id', asyncHandler(ctrl.eliminarCategoria));

router.get('/pedidos', asyncHandler(ctrl.listarPedidos));
router.patch('/pedidos/:id', asyncHandler(ctrl.actualizarEstadoPedido));

module.exports = router;
