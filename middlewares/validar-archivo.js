const { response } = require("express")



const validarArchivoSubir = (req, res = response, next) => {
    
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img ) {
        return res.status(400).json({ 
            ok: false,
            msg: 'No hay archivos que subir'
        });
    }

    return res.status(400).json({ 
        ok: true,
        msg: 'detected'
    });

    next();
}

module.exports= {
    validarArchivoSubir
}