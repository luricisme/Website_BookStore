const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const orderController = require('../../controllers/admin/order.controller');

router.get('/detail/:id_order', orderController.getDetailOrder);
router.get('/status-order', orderController.getOrdersByStatus);
router.patch('/update-status', orderController.updateStatusOfOrder);
router.get('/', orderController.getAllOrders);

module.exports = router;