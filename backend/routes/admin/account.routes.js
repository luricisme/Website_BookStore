const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const accountController = require('../../controllers/admin/account.controller');

router.delete('/delete', accountController.deleteAccount);
router.get('/', accountController.getAllAccount);

module.exports = router;