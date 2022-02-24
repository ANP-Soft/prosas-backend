const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-api-key');
    if (!token) {
        //No hay token de autorizacion en request -- code: 1
        return res.status(401).json({
            ok: false,
            msg: 'Unauthorized -- code: 1'
        });
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //leer usuario que esta haciendo uso del token
        const user = await User.findById(uid);

        //Usuario no existe en DB -- code: 2
        if(!user){
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido -- code: 2'
            });
        }

        //Uid tiene estado en false, (deshabilitado) -- code: 3
        if(!user.status){
            return res.status(403).json({
                ok: false,
                msg: 'Token no válido -- code: 3'
            });
        }

        req.user = user;
        next();

    } catch (err) {
        //Token invalido -- code: 4
        console.log(err);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido -- code: 4'
        });
    }

    

}

module.exports = {
    validarJWT
}