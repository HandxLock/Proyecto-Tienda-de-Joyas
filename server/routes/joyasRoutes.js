const express = require('express');
const { inventario, createNewProduct, updateInventarioStock, deleteProduct, limitJoyas, orderAndLimitProduct, productwithHateoas, productPagination, filterProduct } = require('../src/controllers/joyasControllers.js');

const router = express.Router();

router.get('/', inventario);
router.post('/', createNewProduct);
router.put('/:id', updateInventarioStock);
router.delete('/:id', deleteProduct);
router.get('/product_l', limitJoyas);
router.get('/product_ol', orderAndLimitProduct);
router.get('/hateoas', productwithHateoas);
router.get('/pagination', productPagination)
router.get('/filter', filterProduct)


module.exports = router;
