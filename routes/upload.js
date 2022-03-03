const { Router } = require ('express');
const { check } = require('express-validator');

const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir  } = require('../middlewares');
const { insertarImgCloudinary } = require('../controllers/upload');


const router = Router();

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['products']) ),
    validarArchivoSubir,
    validarCampos
], insertarImgCloudinary);

module.exports = router;