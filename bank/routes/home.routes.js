const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const homeController = require('../controllers/home.controller');

router.get('/get-data', homeController.getData);
router.get('/', homeController.index);

module.exports = router;