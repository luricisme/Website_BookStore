const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const accReqController = require('../controllers/accountReq.controller');

router.put('/valid', accReqController.valid);
router.get('/api', accReqController.getData);
router.get('/', accReqController.index);

module.exports = router;