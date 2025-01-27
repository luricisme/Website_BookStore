const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const statisticalController = require('../../controllers/admin/statistical.controller');

//router.get('/filter', searchController.filter);
router.get('/', statisticalController.index);

module.exports = router;