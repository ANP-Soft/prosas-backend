//validador de colecciones válidas

const { response, request } = require("express")
const mongoose = require('mongoose');
require('dotenv').config();



const conn = mongoose.createConnection(process.env.MONGODB_CNN, { 
                                                                    /* useNewUrlParser: true, 
                                                                    useUnifiedTopology: true,
                                                                    useCreateIndex: true,
                                                                    useFindAndModify: false */
                                                                    //desde mongoose 6.0, esto de arriba no es necesario, por default
                                                                });


const validColection = (req, res = response, next) =>{

    const { collection } = req.params;
    if(collection === 'porCategoria' ) return next(); //condicion para buscar por categoria

    conn.db.listCollections({name: collection})
        .next((err, collinfo)=> {
            if(!collinfo){ 
                return res.status(400).json({
                    ok: false,
                    msg: `La coleccion ${ collection } no existe`
                });
            }
            else{
                //console.log(collinfo);
                next();
            }
        });
}

module.exports= {
    validColection
}