const { Router } = require ('express');
const { check } = require('express-validator');

const { getOrder, getOrders, newOrder, updateOrder, deleteOrder } = require('../controllers/order');
const { existeOrderId, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos, tieneRole } = require('../middlewares');

/**
 *      {{url}}/api/order
 */
const router = Router();

//Todas las rutan de abajo validan JWT
router.use( validarJWT );

//obtener una order por id -- privado -- token valido (get)
router.get('/:id', [
    check('id').custom(existeOrderId),
    
    validarCampos
], getOrder);

//obtener todos las orders -- privado -- token valido (get) 
router.get('/', [
    check('limit', 'Parametro limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('from', 'Parametro from debe ser numerico').isNumeric().optional({ nullable: true }),
    
    validarCampos
], getOrders);

//crear order -- privado -- token valido y admin role(post)
router.post('/', [
    tieneRole('ADMIN_ROLE'),
    check('dateCreated', 'La campo dateCreated es obligatorio').not().isEmpty(),
    check('dateCreated').isDate(),
    check('customer', 'El campo customer es obligatorio').not().isEmpty(),
    check('customer').custom(existeUsuarioPorId),
    check('retiro', 'El campo retiro es obligatorio').not().isEmpty(),
    check('retiro').isBoolean(),
    check('delivery', 'El campo delivery es obligatorio').not().isEmpty(),
    check('delivery').isBoolean(),
    check('deliveryAddress').isString().optional({ nullable: true }),
    check('deliveryPrice').isNumeric().optional({ nullable: true }),
    
    check('content', 'El campo content es obligatorio').not().isEmpty(),
    check('content').isArray(),

    check('paid', 'El campo paid es obligatorio').not().isEmpty(),
    check('paid').isBoolean(),
    check('datePaid').isDate().optional({ nullable: true }),
    check('subtotal', 'El campo subtotal es obligatorio').not().isEmpty(),
    check('subtotal').isNumeric(),
    check('discount').isNumeric().optional({ nullable: true }),
    check('total', 'El campo total es obligatorio').not().isEmpty(),
    check('total').isNumeric(),

    validarCampos 
], newOrder);

//update order -- privado -- token valido y admin role (put)
router.put('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom(existeOrderId),
    check('paid', 'El campo paid es obligatorio').not().isEmpty(),
    check('paid').isBoolean(),
    check('datePaid', 'El campo datePaid es obligatorio').not().isEmpty(),
    check('datePaid').isDate(),
    
    validarCampos
], updateOrder);


//delete order -- privado -- token valido y admin role(delete)
router.delete('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom(existeOrderId),

    validarCampos
], deleteOrder);



module.exports = router;