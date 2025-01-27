const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/user/payment.controller');

router.post('/pre-payment', paymentController.addProductToPayment);
router.get('/form-payment', paymentController.getPaymentForm);
router.post('/finish-payment', paymentController.finishPayment);

module.exports = router;