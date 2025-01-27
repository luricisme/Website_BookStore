const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const userModel = require('../../models/user.model');

let tempCart = [];

router.get('/auth/google',
    (req, res, next) => {
        if (req.session.cart) {
            tempCart = req.session.cart;
        }
        next();
    },
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
    passport.authenticate('google'),
    async (req, res) => {
        try {
            if (req.user) {
                const email = req.user.email;
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "email": req.user.email,
                            "role": req.user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );

                const refreshToken = jwt.sign(
                    { "email": req.user.email },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '3d' }
                );

                await userModel.updateRefreshToken(req.user.email, refreshToken);

                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    secure: true, // Chỉ sử dụng secure cookie trong môi trường production
                    sameSite: 'None', // Cho phép cookie được gửi trong các yêu cầu cross-origin
                    maxAge: 24 * 60 * 60 * 1000 // Thời gian sống của cookie (1 ngày)
                });
                // return res.status(200).json({ accessToken });
                if (tempCart.length > 0) {
                    req.session.cart = tempCart;
                    tempCart = [];
                }
                return res.redirect(`https://localhost:8080?status=200&success=true&accessToken=${accessToken}&role=1`);
            } else {
                return res.redirect(`https://localhost:8080?status=401&success=false&message=Login failed`);
            }
        } catch (err) {
            console.error(err);
            return res.redirect(`https://localhost:8080?status=500&success=false&message=Server error`);
        }
    }
);



module.exports = router;