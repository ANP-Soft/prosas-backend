const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const { User } = require('../models');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/verify-google');
const { facebookVerify } = require('../helpers/verify-facebook');
const { reCaptchaV3Verify } = require('../helpers/verify-reCaptchaV3');


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

        res.status(200).json({
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

    const { _id: uid, name, role } = req.user;
    
    try {

        const token = await generarJWT(uid, name);

        res.status(200).json({
            ok: true,
            token,
            uid,
            name,
            role
        });

    } catch (err) {
        //Error al renovar token -- generarJWT:failed code: 1
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: 'Error al renovar token -- code: 1'
        });
    }

    
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
                    google: true,
                    lastModified: moment().toDate(),
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

            res.status(200).json({
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
                    facebook: true,
                    lastModified: moment().toDate(),
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

            res.status(200).json({
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

const reCaptcha = async (req, res = response) => {

    const { idTokenReCaptcha } = req.body;
    try {
        
        const { success, score } = await reCaptchaV3Verify(idTokenReCaptcha);
        if (!success) {
            //Fallo en comprobacion de estado reCaptcha V3
            return res.status(400).json({
                ok: false,
                msg: 'Error en comprobacion estado reCaptcha v3, tal vez seas un robot'
            })
        } else if (score <= 0.5) {
            //Fallo en comprobacion de score reCaptcha V3
            return res.status(400).json({
                    ok: false,
                    msg: 'Error en comprobacion de score en reCaptcha v3, tal vez seas un robot'
                })
        } else {
            
            return res.status(200).json({
                ok: true,
                msg: 'No eres un robot ;)'
            });
        }
    
    } catch (err) {
        
        //Internal google recaptcha api error
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: 'Internal google recaptcha api error'
        });
    }

}

module.exports = {
    loginUser, 
    revalidarToken, 
    googleSignIn,
    facebookSignIn,
    reCaptcha
}