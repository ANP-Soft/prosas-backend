const { Router } = require ('express');
const { check } = require('express-validator');

const { getOrders, getOrder, newOrder, updateOrder, deleteOrder } = require('../controllers/order');

/**
 *      {{url}}/api/order
 */
const router = Router();

//Todas las rutan de abajo validan JWT
router.use( validarJWT );






module.exports = router;