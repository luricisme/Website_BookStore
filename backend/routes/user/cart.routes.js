const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/user/cart.controller');

router.get('/', cartController.getCart);
router.post('/add', cartController.addProduct);
router.patch('/update', cartController.updateQuantityOfProduct);
router.delete('/delete', cartController.deleteProduct);

module.exports = router;