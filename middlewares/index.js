const validarJWT = require('../middlewares/validar-jwt');
const validarJSON = require('../middlewares/validar-json');
const validaRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');


module.exports = {
    ... validarJWT,
    ... validarJSON,
    ... validaRoles,
    ... validarCampos,
}