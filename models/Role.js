const { Schema, model } = require('mongoose');

const RoleSchema = Schema({

    role: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    lastModified: {
        type: Date,
        required: [true, 'La fecha de modificacion/creacion es obligatoria']
    }
    
});

module.exports = model('Role', RoleSchema);