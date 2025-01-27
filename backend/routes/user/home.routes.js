const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const homeController = require('../../controllers/user/home.controller');

router.get('/book-psychology', homeController.getRandomBooksByPsychology);
router.get('/book-literary', homeController.getRandomBooksByLiterary);
router.get('/book-economy', homeController.getRandomBooksByEconomy);
router.get('/book-novel', homeController.getRandomBooksByNovel);
router.get('/top-book', homeController.getTopSellingBooks);
router.get('/poster', homeController.getPosters);
router.get('/genres', homeController.getCategories);

module.exports = router;