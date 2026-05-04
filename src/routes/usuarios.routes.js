const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const router = express.Router();

router.post('/login', usuarioController.login);
router.get('/', usuarioController.findAll);
router.get('/:id', usuarioController.findOne);
router.post('/', usuarioController.create);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;
