const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./usuarios.routes');
const productosRoutes = require('./productos.routes');

router.use('/usuarios', usuariosRoutes);
router.use('/productos', productosRoutes);

module.exports = router;
