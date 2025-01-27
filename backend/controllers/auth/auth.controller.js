const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../../models/user.model');
const cartModel = require('../../models/user/cart.model');
// [POST]: /login
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    // Mã 400: Bad request
    if (!email || !password ) return res.status(400).json({ 'message': 'Các trường đều phải được nhập' });

    try {
        // console.log('Email:', email);
        // console.log('Password:', pwd);
        const foundUser = await userModel.getUserByEmail(email);
        // console.log('Found User:', foundUser);

        if (!foundUser) {
            return res.status(401).json({ 'message': 'Email không tồn tại' });
        }

        // console.log('PasswordOrGoogleID (hashed password):', foundUser.passwordorgoogleid);
        const match = await bcrypt.compare(password, foundUser.passwordorgoogleid);
        if (match) {
            const role = Object.values(foundUser.role);
            // Tạo accessToken trả về cho frontend
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' } // Hạn 1 tiếng
            );
            const refreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' } // Hạn 1 ngày
            );

            await userModel.updateRefreshToken(foundUser.email, refreshToken);

            // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true, // Chỉ sử dụng secure cookie trong môi trường production
                sameSite: 'None', // Cho phép cookie được gửi trong các yêu cầu cross-origin
                maxAge: 24 * 60 * 60 * 1000 // Thời gian sống của cookie (1 ngày)
            });
            // console.log('Set-Cookie Header:', res.getHeaders()['set-cookie']); // Log thông tin cookie trong header

            // Kiểm tra giỏ hàng tạm thời trong session
            if (req.session.cart && req.session.cart.length > 0) {
                // Merge giỏ hàng từ session vào cơ sở dữ liệu
                for (let item of req.session.cart) {
                    const existingProduct = await cartModel.getBookByIDBook(foundUser.email, item.id_book);

                    if (!existingProduct) {
                        // Nếu sản phẩm chưa có trong giỏ hàng của người dùng, thêm mới vào
                        await cartModel.addBookIntoCart(foundUser.email, item.id_book, item.quantity);
                    } else {
                        // Nếu sản phẩm đã có, cập nhật số lượng
                        await cartModel.updateQuantity(foundUser.email, item.id_book, item.quantity);
                    }
                }

                // Xóa giỏ hàng tạm thời trong session sau khi đã merge
                req.session.cart = [];

                console.log('Dữ liệu giỏ hàng tạm được thêm vào database');
            }

             return res.status(200).json({ 
                accessToken,
                role: foundUser.role
            });
        } else {
            // Mã 401: Lỗi xác thực
            return res.status(401).json({ 'message': 'Mật khẩu không chính xác' });
        }
    } catch (err) {
        console.error(err);
        // Mã 500: Lỗi server
        res.status(500).json({ 'message': 'Lỗi server' });
    }
};

module.exports = { handleLogin };
