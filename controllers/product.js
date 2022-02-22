const { response, request } = require("express");

const { Product } = require('../models');


const getProducts = async (req = request, res = response) => { 

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    try {
        const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find( query )
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user',['name','email'])
            .populate('category', 'name')
        ]);

        res.status(200).json({
            ok: true,
            total,
            products,
        });
    } catch (err) {
        //Error al obtener productos getProducts:fail -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener productos -- code: 1'
        });
    }
}

const getProduct = async (req = request, res = response) => {
   
    const { id } = req.params; 
    try {

        const product = await Product.findById(id)
                                .populate('user', ['name','email'])
                                .populate('category', 'name');
    
        res.status(200).json({
            ok: true,
            product,
        });

    } catch (err) {
        //Error al obtener productos getProduct:fail --  code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener productos -- code: 2'
        });
    }
}

const newProduct = async (req = request, res = response) => {
   
    const { status, user, ...body } = req.body; //en body: name, category, price, description, stock, img

    try {

        const existeProductoDB = await Product.findOne({ name: body.name.toUpperCase() });
        if (existeProductoDB) {
            //Error al crear producto newProduct:fail --  code: 1
            //El producto X, ya existe, no se puede añadir
            return res.status(400).json({
                ok: false,
                msg: `Error al crear producto -- code: 1`
            });
        }

        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        };

        const product = new Product(data);
        await product.save();
        res.status(201).json({
            ok: true,
            product
        });
        

    } catch (err) {
        //Error al crear producto newProduct:fail --  code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error crear producto -- code: 2'
        });
    }
}

const updateProduct = async (req = request, res = response) => {
   
    const { id } = req.params;
    const { status, user, ...body } = req.body; //en body: name, category, price, description, stock, img //no se actualiza ni status ni user introducido por REQUEST

    try {
        
        if (!(body.name || body.category || body.price || body.description || body.stock || body.img)) {
            //Error al actualizar producto -- code: 1
            //No hay datos que actualizar
            res.status(400).json({
                ok: false,
                msg: 'Error al actualizar producto -- code: 1'
            });
        }

        const data = {
            ...body,
            user: req.user._id
        }

        if (body.name) data.name = body.name.toUpperCase();

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            product    
        });


    } catch (err) {
        //Error realizar update producto updateProduct:fail -- code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error realizar update producto -- code: 2'
        });
    }
}

const deleteProduct = async (req = request, res = response) => {
 
    const { id } = req.params;

    try {

        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
        
        res.status(200).json({
            ok: true,
            product
        });

    } catch (err) {
        //Error al deshabilitar/borrar producto deleteProduct:fail -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error realizar borrado de producto -- code: 1'
        });
    }
}


module.exports = {
    getProducts,
    getProduct,
    newProduct,
    updateProduct,
    deleteProduct
}
