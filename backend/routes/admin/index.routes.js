const path = require('path'); // Xử lý đường dẫn tệp
const express = require('express');
const router = express.Router();

const statisticalRoutes = require('./statistical.routes');
const categoriesRoutes = require('./categories.routes');
const bookRoutes = require('./book.routes');
const accountRoutes = require('./account.routes');
const orderRoutes = require('../admin/order.routes');
const posterRoutes = require('../admin/poster.routes');


router.use('/categories', categoriesRoutes);
router.use('/books', bookRoutes);
router.use('/account', accountRoutes);
router.use('/order', orderRoutes);
router.use('/poster', posterRoutes);
router.use('/', statisticalRoutes);

module.exports = router;
