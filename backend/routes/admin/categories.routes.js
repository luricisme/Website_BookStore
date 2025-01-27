const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const categoriesController = require('../../controllers/admin/categories.controller');

router.delete('/delete', categoriesController.delete);
router.put('/change', categoriesController.change);
router.post('/add', categoriesController.add);
router.get('/', categoriesController.index);

module.exports = router;