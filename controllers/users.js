const { response } = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generarJWT } = require('../helpers/jwt');

const newUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        //Mail ya asociado a un usuario
        if (user) {
            //Error mail ya se encuentra registrado en bd -- code: 1
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear usuario -- code: 1'
            });
        }

        user = new User(req.body);
        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generate JWT
        const token = generarJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            role: user.role,
            token
        });
        
    } catch (err) {
        //Error al crear usuario -- code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear usuario -- code: 2'
        })
    }
}

const updateUser = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, ...resto  } = req.body; //Rest Parameters, gathers the rest of the list of arguments into an array

    try {

        //Si es cambio de contraseña
        if(password){
            //Encriptar la contraseña
            const salt = bcrypt.genSaltSync();
            resto.password = bcrypt.hashSync(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            ok: true,
            ...user
        });

    } catch (err) {
        //Error en servicio de update User -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al realizar update User -- code: 1'
        })
    }
}

const getUser = async (req, res = response) => {

    const { limit = 5, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            ok: true,
            total,
            users
        });
    }
    catch (err) {
        //Error en servicio de obtener Users -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener Users -- code: 1'
        });
    }

    

}

const deleteUser = async (req, res = response) => {
    
    const { id } = req.params;

    try {

        //status: false
        const user = await User.findByIdAndUpdate(id, { status: false });
        res.status(200).json({
            ok: true,
            user
        });

    } catch (err) {
        //Error en servicio de deshabilitar/borrar Users -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar Users -- code: 1'
        });
    }

    
}

module.exports = {
    newUser,
    updateUser,
    getUser,
    deleteUser,
}


