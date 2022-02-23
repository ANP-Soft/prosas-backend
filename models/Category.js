const { Schema, model } = require('mongoose');
const { AutoIncrement } = require('../db/config');

const CategorySchema = Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


CategorySchema.methods.toJSON = function(){  //funcion normal para llamar a this de esta instancia, si fuera funcion de flecha llamar al this apunta a la instancia fuera de la misma
    const { __v, _id, ... category } = this.toObject();
    category.catId = _id;

    return category;
}

CategorySchema.plugin(AutoIncrement, { inc_field: 'code', start_seq: 100 });

module.exports = model('Category', CategorySchema);