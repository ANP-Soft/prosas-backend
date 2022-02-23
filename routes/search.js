const { Router } = require('express');

const { validColection, validarCampos } = require('../middlewares');
const { search } = require('../controllers/search');



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