const validarJWT = require('../middlewares/validar-jwt');
const validarJSON = require('../middlewares/validar-json');
const validaRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');
const validColection = require('../middlewares/validar-coleccion');
const validArchivo = require('../middlewares/validar-archivo');


module.exports = {
    ... validarJWT,
    ... validarJSON,
    ... validaRoles,
    ... validarCampos,
    ... validColection,
    ... validArchivo
}