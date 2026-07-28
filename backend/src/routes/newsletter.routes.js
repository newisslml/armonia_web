const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const ctrl = require('../controllers/newsletter.controller');

const router = Router();

router.post('/', asyncHandler(ctrl.suscribir));

module.exports = router;
