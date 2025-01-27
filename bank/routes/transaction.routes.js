const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/api', transactionController.getData);
router.get('/', transactionController.index);

module.exports = router;