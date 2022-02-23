const { Role, User, Category, Product, Order } = require('../models');



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
    //Verificar que existe ID de usuario
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


//Validadores de Categoria
    //Verificar si existe ID de categoria
const existeCategoriaId = async (_id) => {
    //si no es nulo el valor
    if(_id){
        //verificar si cumple la regla de id de mongo
        if (_id.match(/^[0-9a-fA-F]{24}$/)) {

            //Verificar si la categoria existe
            const existeCat = await Category.findById({ _id });

            if(!existeCat){
                throw new Error(`El ID de categoria ${ _id } no existe`);
            }

            //verificar si la categoria esta borrada
            if(!existeCat.estado)
            {
                throw new Error(`La categoria se encuentra deshabilitada`);    
            }

        } else {
            throw new Error(`El ID de categoria ${ _id } no es válido`);
        }
    }
}
    //Verificar si existe nombre de categoria
const existeCategoriaNombre = async (name = '') => {

    const existeCatNombre = await Category.findOne({name});
    if (existeCatNombre) {
        throw new Error(`El nombre ${existeCatNombre.name} ya se encuentra registrado a una categoria, no se puede actualizar`);
    }
}


//Validadores de Producto
    //Verificar si existe id producto
const existeProductoId = async (_id) => {
    //verificar si cumple la regla de id de mongo
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {

        //Verificar si el producto existe
        const existeProd = await Product.findById({ _id });

        if(!existeProd){
            throw new Error(`El ID de producto ${ _id } no existe`);
        }

        //verificar si el producto esta borrada
        if(!existeProd.status)
        {
            throw new Error(`El producto se encuentra deshabilitado`);    
        }

    } else {
        throw new Error(`El ID de producto ${ _id } no es válido`);
    }

}
    //Verificar si existe nombre de producto
const existeProductoNombre = async (name = '') => {
    
    const existeProdNombre = await Product.findOne({ name: name.toUpperCase() });
    if(existeProdNombre){
        throw new Error(`El producto ${ existeProdNombre.name } ya se encuentra registrado, no se puede actualizar`);
    }
}


//Validadores de Orden
    //Verificar si existe id orden
const existeOrderId = async (_id) => {
    //verificar si cumple la regla de id de mongo
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {

        //Verificar si la orden existe
        const existeOrden = await Order.findById({ _id });

        if(!existeOrden){
            throw new Error(`El ID de orden ${ _id } no existe`);
        }

        //verificar si la orden esta borrada
        if(!existeOrden.status)
        {
            throw new Error(`La orden se encuentra deshabilitada`);    
        }

    } else {
        throw new Error(`El ID de orden ${ _id } no es válido`);
    }


}

//NOT USED, using --> mongo-secuence autoIncrement
// const existeOrderNumber = async (number) => {
    
//     const existeOrderNumber = await Order.findOne({ number });
//     if (existeOrderNumber) {
//         throw new Error(`El numero de orden ${existeOrderNumber.number} ya se encuentra en uso, no se puede crear`);
//     }
// }

module.exports = {
    esRoleValido,
    emailExiste,
    
    existeUsuarioPorId,
    
    existeCategoriaId,
    existeCategoriaNombre,
    
    existeProductoId,
    existeProductoNombre,
    
    existeOrderId,
}