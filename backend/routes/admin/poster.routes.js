const express = require('express'); 
const router = express.Router();
const uploadCloud = require('../../config/cloudinary'); 
const posterController = require('../../controllers/admin/poster.controller');

router.post('/add', uploadCloud.single('images'), posterController.addPoster);
router.delete('/delete', posterController.deletePoster);
router.get('/', posterController.getAllPoster);

module.exports = router;