const { response, request } = require("express");

const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    try {

        const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user', ['name','email'])
        ]);

        res.status(200).json({
            ok: true,
            total,
            categories
        });

    } catch (err) {
        //Error al obtener categorias getCategories:failed-- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener categoria -- code: 1'
        });
    }
}

const getCategory = async (req = request, res = response) => {

    const { id } = req.params;
    try {

        const category = await Category.findById(id)
            .populate('user', ['name', 'email']);
        
        res.status(200).json({
            ok: true,
            category
        });
        
    } catch (err) {
        //Error al obtener categorias getCategory:failed -- code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener categoria -- code: 2'
        });
    }

}

const newCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();
    const { lastModified } = req.body;

    try {

        const categoryDB = await Category.findOne({ name });
        //verifica que no exista una categoria igual
        if(categoryDB){
            return res.status(400).json({
                ok: false,
                msg: `La categoria ${categoryDB.name}, ya existe, no se puede añadir`
            });
        }

        //Generar data a guardar
        const data = {
            name,
            user: req.user._id,
            lastModified
        }
        const category = new Category(data);
        //Grabar data
        await category.save();
        res.status(201).json({
            ok: true,
            category
        });
        
    } catch (err) {
         //Error al crear categoria newCategory:failed -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear categoria -- code: 1'
        });
    }
}

const updateCategory = async (req = request, res = response) => { 

    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const { lastModified } = req.body;

    try {
        //otra opcion es desestructurar req.body, para dejar afuera los que no necesitamos actualizar por seguridad --> estado, usuario , en lo anterior solo se saca del body lo que es necesario actualizar -> nombre
        const data = {
            name,
            user: req.user._id,
            lastModified
        }

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            category   
        });

    } catch (err) {
         //Error al realizar update categoria updateCategory:failed -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al realizar update categoria -- code: 1'
        });
    }
}

const deleteCategory = async (req = request, res = response) => {
    //deleteCategory - estado:false
    const { id } = req.params;

    try {
        
        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });
        
        res.status(200).json({
            ok:true,
            category
        });

    } catch (err) {
        //Error al realizar deshabilitado/borrado de categoria deleteCategory:failed -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al realizar borrado categoria -- code: 1'
        });
    }
}

module.exports = {
    getCategories,
    getCategory,
    newCategory,
    updateCategory,
    deleteCategory
}
