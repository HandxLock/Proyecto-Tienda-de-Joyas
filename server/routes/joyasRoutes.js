const express = require('express');
const { inventario, createNewProduct, updateInventarioStock, deleteProduct, limitJoyas, orderAndLimitProduct, productwithHateoas, productPagination, filterProduct } = require('../src/controllers/joyasControllers.js');
const {consulta, Parametros} =require('../middleware/middleware.js')
const router = express.Router();

router.get('/', inventario);
router.post('/', createNewProduct);
router.put('/:id',Parametros, updateInventarioStock);
router.delete('/:id',Parametros, deleteProduct);
router.get('/product_l', limitJoyas);
router.get('/product_ol', orderAndLimitProduct);
router.get('/hateoas', productwithHateoas);
router.get('/pagination', productPagination)
router.get('/filtros', consulta, filterProduct)


module.exports = router;
