const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require('express');
const moment = require('moment');

const { Product } = require('../models');

const insertarImgCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch(coleccion){
        
        // case 'users':
        //     modelo = await User.findById(id);
        //     if(!modelo){
        //         return res.status(400).json({ ok:false, msg: `No existe un usuario con id ${ id }` });
        //     }
        // break;

        case 'products':
            modelo = await Product.findById(id);
            if(!modelo){
                return res.status(400).json({ ok: false, msg: `No existe un producto con id ${ id }` });
            }
        break;

        default:
            return res.status(500).json({ ok: false, msg: 'Caso no validado' })
    }

    //Limpiar imgs previas
        //ej: https://res.cloudinary.com/nhf/image/upload/v1628644450/ren1qaudro56imrd7wzp.png

    
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const[ public_id, extension ] = nombre.split('.');
        
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.img;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;
    modelo.lastModified = moment().toDate();
    await modelo.save();

    return res.json({
        ok: true,
        product: modelo
    });
}

module.exports = {
    insertarImgCloudinary
}