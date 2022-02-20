const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../models');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/verify-google');
const { facebookVerify } = require('../helpers/verify-facebook');


const loginUser = async (req = request, res = response) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        
        //User no existe -- code: 1
        if (!user) { 
            return res.status(400).json({
                ok: false,
                msg: 'Error al logear usuario -- code: 1'
            });
        }

        //Password incorrecta -- code: 2
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al logear usuario -- code: 2'
            });
        }

        //User status:'false' deshabilitado por admin -- code: 3
        if (!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'Error al logear usuario -- code: 3'
            });
        }

        //Generar JWT
        const token = await generarJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            role: user.role,
            token
        });
    }
    //Internal server error, revisar log -- code: 4
    catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al logear usuario -- code: 4'
        });
    }
}

const revalidarToken = async (req , res = response) => {

    const { _id: uid, name, role} = req.user;
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid,
        name,
        role
    });
}

const googleSignIn = async (req, res = response) => {
    
    const { id_token } = req.body;
    try{ 
        const { aud, name, email } = await googleVerify(id_token);
        
        if (aud === process.env.GOOGLE_CLIENT_ID) {
            let user = await User.findOne({ email });

            if(!user){
                //No existe usuario --> Hay que crearlo
                const data = {
                    name,
                    email,
                    password: ':P',
                    google: true
                };

                user = new User(data);
                await user.save();
            }

            if (!user.status) {
               //Usuario existe, status: false en bd. -- code: 1
                return res.status(401).json({
                    ok: false,
                    msg: 'Error al logear usuario por google -- code: 1'
                });
            }

            //GENERAR EL JWT
            const token = await generarJWT(user.id);

            res.json({
                ok: true,
                user,
                token
            });

        } else {
            //Token invalido -- code: 2
           return res.status(400).json({
                ok: false,
                msg: 'Error al logear usuario por google -- code: 2'
            }); 
        }

    } catch (err) {
        //Internal google error, revisar log -- code: 3
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: 'Error al logear usuario por google -- code: 3'
        });
    }
}

const facebookSignIn = async (req, res = response) => {
    
    const { id_token, name, email } = req.body;
    try{ 

        const { app_id, is_valid, application } = await facebookVerify(id_token);
        if(is_valid && app_id === process.env.FACEBOOK_CLIENT_ID && application === process.env.FACEBOOK_CLIENT_APP_NAME){
            
            let user = await User.findOne({ email });
            if(!user){
                //No existe usuario --> Hay que crearlo
                const data = {
                    name,
                    email,
                    password: ':P',
                    facebook: true
                };
    
                user = new User(data);
                await user.save();
            }

            if (!user.status) {
                //Usuario existe, status: false en bd. -- code: 1
                return res.status(401).json({
                    ok: false,
                    msg: 'Error al logear usuario por facebook -- code: 1'
                });
            }

            //GENERAR EL JWT
            const token = await generarJWT(user.id);

            res.json({
                ok: true,
                user,
                token
            });

        } else {
            //Token invalido -- code: 2
            return res.status(400).json({
                ok: false,
                msg: 'Error al logear usuario por facebook -- code: 2'
            });
        }

    } catch (err) {
        //Internal facebook error, revisar log -- code: 3
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: 'Error al logear usuario por facebook -- code: 3'
        });
    }

}

module.exports = {
    loginUser, 
    revalidarToken, 
    googleSignIn,
    facebookSignIn
}