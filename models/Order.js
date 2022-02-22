const { Schema, model } = require('mongoose');

const OrderSchema = Schema({

    number: {
        type: Number,
        required: [true, 'Numero de orden es obligatorio'],
        unique: true
    },
    dateCreated: {
        type: Date,
        required: [true, 'Fecha de creacion es obligatorio'],
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    retiro: {
        type: Boolean,
        required:  [true, 'Retiro es obligatorio'],
    },
    delivery: {
        type: Boolean,
        required: [true, 'Delivery es obligatorio'],
    },
    deliveryAddress: {
        type: String,
        default: ''
    },
    deliveryPrice: {
        type: Number,
        default: 0
    },
    content: {
        type: [Schema.Types.Mixed],
        required: [true, 'Contenido de Orden es obligatorio'],
    },
    paid: {
        type: Boolean,
        required: [true, 'Pagado es obligatorio'],
    },
    datePaid: {
        type: Date
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal es obligatorio'],
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: [true, 'Total es obligatorio'],
    },
    status: {
        type: Boolean,
        default: true
    }
});

OrderSchema.methods.toJSON = function () {
    const { __v, _id, ...data } = this.toObject();
    data.ordId = _id;

    return data;
}

module.exports = model('Order', OrderSchema);