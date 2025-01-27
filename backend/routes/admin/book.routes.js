const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const bookController = require('../../controllers/admin/book.controller');
const uploadCloud = require('../../config/cloudinary'); 

router.delete('/delete', bookController.delete);
router.put('/change', uploadCloud.array('images', 10), bookController.change);
router.post('/add', uploadCloud.array('images', 10), bookController.add);
router.get('/', bookController.index);

module.exports = router;