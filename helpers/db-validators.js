const { Role, User } = require('../models');



//Validadores de Usuario

    //Verificar que Rol exista
const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if(!existeRol){
            throw new Error(`El role ${ role } no esta registrado en la DB`); //--> error personalizado atrapado en el custom
    }
}

    //Verificar si el correo existe
const emailExiste = async (email = '') => {
    const existeEmail = await User.findOne({ email });
    if(existeEmail){
        throw new Error(`El email ${ email } ya esta registrado`);
    }
}

    //Verficiar que existe ID de usuario
const existeUsuarioPorId = async (_id) => {
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await User.findById({ _id });
        if(!existeUsuario){
            throw new Error(`El ID ${ _id } no existe`);
        }
    } else {
        throw new Error(`El ID ${ _id } no es válido`);
    }   
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}