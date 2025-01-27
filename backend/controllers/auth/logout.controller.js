const userModel = require('../../models/user.model');

// [POST]: /logout
handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        // console.log('COOKIES LOGOUT: ', cookies);
        if (!cookies?.jwt) return res.sendStatus(204);
        const refreshToken = cookies.jwt;
        console.log('REFRESH TOKEN: ', refreshToken);

        const foundUser = await userModel.getUserByRefreshToken(refreshToken);
        // console.log('LOGOUT: ', foundUser);
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true --> Khi deploy thì thêm vào
            return res.sendStatus(204);
        };

        foundUser.refresh_token = '';
        const result = await userModel.updateRefreshToken(foundUser.email, foundUser.refresh_token); // Cập nhật lại refreshToken thành rỗng
        // console.log('USER AFTER LOGOUT: ', result);

        res.clearCookie('jwt', { httpOnly: true, secure: true }); // secure: true --> Khi deploy thì thêm vào
        req.logout((err) => {
            if (err) {
                console.error('Lỗi đăng xuất: ', err);
            }
        });
        console.log('ĐÃ ĐĂNG XUẤT');
        res.sendStatus(204);
    } catch (err) {
        console.error('Lỗi trong quá trình đăng xuất: ', err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports = { handleLogout }