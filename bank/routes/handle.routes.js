const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const handleController = require('../controllers/handle.controller');
const { authenticateToken } = require('../middlewares/authTokenSecret'); // Import middleware xác thực token
const jwt = require('jsonwebtoken');

router.post('/generate-token', (req, res) => {
    const { email } = req.body;  // Lấy email từ request body
    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Tạo payload từ email
    const payload = { email };

    // Tạo token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_BANK, { expiresIn: '1h' });  // Thời gian hết hạn 1 giờ
    res.json({ token });  // Gửi token cho client
});
router.post('/register', authenticateToken, handleController.register);
router.post('/refund', authenticateToken, handleController.refund);
router.post('/get', authenticateToken, handleController.get);
router.post('/pay', authenticateToken, handleController.pay);

module.exports = router;