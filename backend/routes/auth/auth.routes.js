const express = require('express');
const router = express.Router();

const registerController = require('../../controllers/auth/register.controller');
const authController = require('../../controllers/auth/auth.controller');
const refreshController = require('../../controllers/auth/refresh.controller');
const logoutController = require('../../controllers/auth/logout.controller');

router.post('/register', registerController.handleNewUser);
router.post('/login', authController.handleLogin);

/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Lấy access token mới từ refresh token
 *     description: API này dùng để lấy access token mới nếu người dùng có refresh token hợp lệ.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: cookie
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh token của người dùng
 *     responses:
 *       200:
 *         description: Thành công, trả về access token mới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Không có refresh token (Unauthorized)
 *       403:
 *         description: Refresh token không hợp lệ hoặc không khớp với người dùng (Forbidden)
 */
router.get('/refresh', refreshController.handleRefreshToken);

router.post('/logout', logoutController.handleLogout);

module.exports = router;
