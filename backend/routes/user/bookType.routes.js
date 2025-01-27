const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const bookTypeController = require('../../controllers/user/bookType.controller');

router.get('/filter', bookTypeController.filter);
router.get('/', bookTypeController.index);

module.exports = router;