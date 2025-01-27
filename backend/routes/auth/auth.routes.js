const express = require('express');
const router = express.Router();

const registerController = require('../../controllers/auth/register.controller');
const authController = require('../../controllers/auth/auth.controller');
const refreshController = require('../../controllers/auth/refresh.controller');
const logoutController = require('../../controllers/auth/logout.controller');

router.post('/register', registerController.handleNewUser);
router.post('/login', authController.handleLogin);
router.get('/refresh', refreshController.handleRefreshToken);
router.post('/logout', logoutController.handleLogout);

module.exports = router;
