// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET_BANK;  // Thay thế với secret key của bạn

// Middleware kiểm tra token
function authenticateToken(req, res, next) {
    // Xem header trong console
console.log(req.headers);
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Token is invalid');
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
