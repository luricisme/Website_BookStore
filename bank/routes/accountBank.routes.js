const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const accController = require('../controllers/accountBank.controller');

router.get('/history', accController.history);
router.put('/change', accController.change);
router.get('/api', accController.getData);
router.get('/', accController.index);

module.exports = router;