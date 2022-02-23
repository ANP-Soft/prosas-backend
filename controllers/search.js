const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product, Order } = require('../models');

const searchUsers = async (word = '', res = response) => {
    
    const isMongoID = ObjectId.isValid(word);
    //SI es ID Mongo
    if (isMongoID) {
        const user = await User.findById(word);
        return res.status(200).json({
            ok: true,
            results: (user) ? [user] : []
        });
    }

    //NO es ID Mongo
    const regex = new RegExp(word, 'i');
    const user = await User.find({
        $or: [{ name: regex }, { email: regex }, { role: regex }],
        $and: [{ status: true }]
    });

    return res.status(200).json({
        ok: true,
        results: user
    });
}

const searchCategories = async (word = '', res = response) => {
    
    const isMongoID = ObjectId.isValid(word);
    //SI es ID Mongo
    if (isMongoID) {
        const category = await Category.findById(word)
                                .populate('user', ['name', 'email']);
        return res.status(200).json({
            ok: true,
            results: (category) ? [category] : []
        });
    }

    //No es ID Mongo
    const regex = new RegExp(word, 'i');
    const category = await Category.find({
        $or: [{ name: regex }, { code: regex }],
        $and: [{ status: true }]
        }).populate('user', ['name', 'email']);;
    
    return res.status(200).json({
        ok: true,
        results: category
    });
}

const searchProducts = async (word = '', res = response) => {
    
    const isMongoID = ObjectId.isValid(word);
    //SI es ID Mongo
    if (isMongoID) {
        const product = await Product.findById(word)
                                .populate('category', ['name', 'code'])
                                .populate('user', ['name', 'email']);
        
        return res.status(200).json({
            ok: true,
            results: (product) ? [product] : []
        });
    }

    //No es ID Mongo
    const regex = new RegExp(word, 'i');
    const product = await Product.find({
        $or: [{ name: regex }, { description: regex }, { sku: regex }],
        $and: [{ status: true }]
                }).populate('category', ['name', 'code'] )
        .populate('user', ['name', 'email']);
    
    return res.status(200).json({
        ok: true,
        results: product
    });
}

const searchOrder = async (word = '', res = response) => {
    
    const isMongoID = ObjectId.isValid(word);
    //SI es ID Mongo
    if (isMongoID) {
        const order = await Order.findById(word)
            .populate('customer', ['name', 'email'])
            .populate('lastModifiedBy', ['name', 'email']);
        
        return res.status(200).json({
            ok: true,
            results: (order) ? [order] : []
        });
    }

    //No es ID Mongo
    const regex = new RegExp(word, 'i');
    const order = await Order.find({
        $or: [{ number: regex }, { customer: regex }],
        $and: [{ status: true }]
        }).populate('customer', ['name', 'email'])
        .populate('lastModifiedBy', ['name', 'email']);;

    return res.status(200).json({
        ok: true,
        results: order
    });
}

const search = async (res = response, req = request) => {

    const { collection, word } = req.params;

    switch (collection) {

        case 'user':
            //search by 'name' or 'email' or 'role'
            searchUsers(word, res);
            break;
        
        case 'category':
            //search by 'name', 'code'
            searchCategories(word, res);
            break;
    
        case 'product':
            //search by 'name', 'description', 'sku'
            searchProducts(word, res);
            break;
    
        case 'order':
            //search by 'number','customer(idmongo)'
            searchOrder(word, res);
            break;
        
        default:
            return res.status(200).json({
                ok: true,
                msg: `La busqueda para la coleccion ${collection} no esta implementada, consultelo con el administrador del sistema`
            });

    }
}



module.exports = {
    search
}