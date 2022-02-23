const { Schema, model } = require('mongoose');
const { AutoIncrement } = require('../db/config');

const OrderSchema = Schema({

    dateCreated: {
        type: Date,
        required: [true, 'dateCreated es obligatorio'],
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    retiro: {
        type: Boolean,
        required:  [true, 'retiro es obligatorio'],
    },
    delivery: {
        type: Boolean,
        required: [true, 'delivery es obligatorio'],
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
        required: [true, 'content es obligatorio'],
    },
    paid: {
        type: Boolean,
        required: [true, 'paid es obligatorio'],
    },
    datePaid: {
        type: Date
    },
    subtotal: {
        type: Number,
        required: [true, 'subtotal es obligatorio'],
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: [true, 'total es obligatorio'],
    },
    status: {
        type: Boolean,
        default: true
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

OrderSchema.methods.toJSON = function () {
    const { __v, _id, ...order } = this.toObject();
    order.ordId = _id;

    return order;
}

OrderSchema.plugin(AutoIncrement, { inc_field: 'number', start_seq: 1000 });

module.exports = model('Order', OrderSchema);