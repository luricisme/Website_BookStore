const userModel = require('../../models/user.model');
const jwt = require('jsonwebtoken');

// [GET]: /refresh
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log('COOKIES REFRESH: ', req.cookies);
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await userModel.getUserByRefreshToken(refreshToken);
    if(!foundUser) return res.sendStatus(403);
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.email !== decoded.email) return res.sendStatus(403);
            const role = Object.values(foundUser.role);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )
            return res.status(200).json({ accessToken });
        }
    )
}

module.exports = { handleRefreshToken }