const express = require('express');
const productoController = require('../controllers/productos.controller');
const router = express.Router();

router.get('/', productoController.findAll);
router.get('/:id', productoController.findOne);
router.post('/', productoController.create);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.delete);

module.exports = router;
