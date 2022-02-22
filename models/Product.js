const { Schema, model } = require('mongoose');

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
    product.uid = _id;
    return product;
    //user;
}

module.exports = model('Product', ProductSchema );