const { Router } = require('express');

const { search } = require('../controllers/search');
const { validColection, validarCampos } = require('../middlewares');



const router = Router();

/*
    Rutas de Usuarios
    {{url}} + /api/search
*/

router.get('/:collection/:word', [
    validColection,
    validarCampos
], search);






module.exports = router;