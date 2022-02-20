const { response, request } = require("express")


const esAdminRole = (req, res = response, next) =>{
    
    if(!req.user){
        return res.status(500).json({
            ok: false,
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        
        return res.status(403).json({
            ok: false,
            msg: `El usuario ${ name } no esta autorizado -- code : 2`
        });
    }

    next();

}

const tieneRole = (...roles) => {

    return (req, res= response, next) => {
        
        //verificacion del token
        if(!req.user){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        //verificacion que el usuario posee un rol especifico
        if(!roles.includes(req.user.role))
        {
            return res.status(401).json({
                msg: `El servicio requiere de uno de estos roles: ${ roles }`
            });
        }
        
        next();
    }

}

module.exports= {
    esAdminRole,
    tieneRole
}

