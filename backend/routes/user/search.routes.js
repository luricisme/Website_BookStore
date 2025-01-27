const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const searchController = require('../../controllers/user/search.controller');

router.get('/filter', searchController.filter);
router.get('/', searchController.index);

module.exports = router;