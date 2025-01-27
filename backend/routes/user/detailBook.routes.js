const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const detailBookController = require('../../controllers/user/detailBook.controller');
const uploadCloud = require('../../config/cloudinary'); 
const verifyJWT = require('../../middlewares/auth/verifyJWT');
const verifyRole = require('../../middlewares/auth/verifyRole');

router.post('/review', verifyJWT, verifyRole('user'), uploadCloud.array('images', 10), detailBookController.review);
router.get('/get-reviews', detailBookController.getReviews);
router.get('/', detailBookController.index);

module.exports = router;