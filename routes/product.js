const { Router } = require ('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { existeProductoId, existeCategoriaId, existeProductoNombre } = require('../helpers/db-validators');
const { getProduct, getProducts, newProduct, updateProduct, deleteProduct } = require('../controllers/product');
const { isDate } = require('../helpers/date-validators');

/**
 *      {{url}}/api/product
 */
const router = Router();

//obtener un producto por id -- publico (get)
router.get('/:id', [
    check('id').custom(existeProductoId),
    
    validarCampos
], getProduct);

//obtener todos los productos -- publico (get) 
router.get('/', [
    check('limit', 'Parametro limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('from', 'Parametro from debe ser numerico').isNumeric().optional({ nullable: true }),
    
    validarCampos
], getProducts);

//Todas las rutan de abajo validan JWT
router.use( validarJWT );

//crear producto -- privado -- token valido y admin role(post)
router.post('/', [
    tieneRole('ADMIN_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom(existeProductoNombre),
    check('category','La categoria es obligatoria').not().isEmpty(),
    check('category').custom(existeCategoriaId),
    check('price').isNumeric().optional({ nullable: true }),
    check('description').isString().optional({ nullable: true }),
    check('stock').isNumeric().optional({ nullable: true }),
    check('url').isString().optional({ nullable: true }),
    check('lastModified').custom( isDate ),

    validarCampos 
], newProduct);

//actualizar un producto por id -- privado -- token valido y admin role(put)
router.put('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom(existeProductoId),
    check('name').custom(existeProductoNombre).optional({ nullable: true }),
    check('category').custom(existeCategoriaId).optional({ nullable: true }),
    check('price').isNumeric().optional({ nullable: true }),
    check('description').isString().optional({ nullable: true }),
    check('stock').isNumeric().optional({ nullable: true }),
    check('url').isString().optional({ nullable: true }),
    check('lastModified').custom( isDate ),

    validarCampos
], updateProduct);


//borrar un producto por id -- privado -- token valido y admin role(delete)
router.delete('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeProductoId ),
    
    validarCampos
], deleteProduct);






module.exports = router;