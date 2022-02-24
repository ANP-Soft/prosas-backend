const { Schema, model } = require('mongoose');
const { AutoIncrement } = require('../db/config');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0
    },
    img: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    }
});

ProductSchema.methods.toJSON = function(){  //funcion normal para llamar a this de esta instancia, si fuera funcion de flecha llamar al this apunta a la instancia fuera de la misma
    const { __v, _id, ...product } = this.toObject();
    product.pid = _id;
    return product;
}

ProductSchema.plugin(AutoIncrement, { inc_field: 'sku', start_seq: 1000 });

module.exports = model('Product', ProductSchema);