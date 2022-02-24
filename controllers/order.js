const { response, request } = require("express");

const { Order } = require('../models');

const getOrders = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    try {
        
        const [total, orders] = await Promise.all([
            Order.countDocuments(query),
            Order.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('customer', ['name', 'email'])
                .populate({
                    path: 'content',
                    populate: {
                        path: 'product',
                        select: ['name', 'price', 'sku']
                    }
                })
            ]);

        res.status(200).json({
            ok: true,
            total,
            orders
        });

    } catch (err) {
        //Error al obtener orders getOrders:failed-- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener orders -- code: 1'
        });
    }

}

const getOrder = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const order = await Order.findById(id)
            .populate('customer', ['name', 'email'])
            .populate({
                path: 'content',
                populate: {
                    path: 'product',
                    select: ['name', 'price', 'sku']
                }
            });
        
        res.status(200).json({
            ok: true,
            order
        });

    } catch (err) {
        //Error al obtener orders getOrder:failed-- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener order -- code: 1'
        });
    }
}

const newOrder = async (req = request, res = response) => {
    
    //body
    //Required --> dateCreated, customer, retiro, delivery, content, paid, subtotal, total
    //Optional --> deliveryAddress, deliveryPrice, datePaid, discount
    const { user, number, ...body } = req.body;

    try {

        //Generar data a guardar
        const data = {
            ...body,
            lastModifiedBy: req.user._id
        };

        const order = new Order(data);
        await order.save();
        res.status(201).json({
            ok: true,
            order
        });

    } catch (err) {
        //Error al crear order newOrder:failed-- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear order -- code: 1'
        });
    }

}

const updateOrder = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        //cambiable --> paid, datePaid
        const { paid, datePaid,  ...body } = req.body; //en body: number, dateCreated, customer, retiro, delivery, deliveryAddress, deliveryPrice, content, subtotal, discount, total, status

        let data;
        if (!!datePaid) { 
            data = {
                paid,
                datePaid
            }
        } else {
            data = {
                paid
            }
        }

        

        const order = await Order.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            order    
        });


    } catch (err) {
        //Error al update order updateOrder:failed-- code: 2
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error al update order -- code: 2'
        });
    }

}

const deleteOrder = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const order = await Order.findByIdAndUpdate(id, { status: false }, { new: true });
        
        res.status(200).json({
            ok: true,
            order
        });

    } catch (err) {
        //Error al deshabilitar/borrar orden deleteOrder:fail -- code: 1
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error realizar borrado de orden -- code: 1'
        });
    }

}

module.exports = {
    getOrders,
    getOrder,
    newOrder,
    updateOrder,
    deleteOrder
}
