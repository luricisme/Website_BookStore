const axios = require('axios');
const userModel = require('../../models/user.model');
const bcrypt = require('bcrypt');
const https = require('https');

const pool = require('../../config/database');

// Public thì bỏ đi
const agent =
    process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;

// [POST]: /register
const handleNewUser = async (req, res) => {
    const client = await pool.connect();
    // console.log('BODY CLIENT SENT: ', req.body);
    const { email, name, phone, password, confirmedPassword } = req.body;
    console.log('REQ BODY: ', req.body);
    // Mã 400: Lỗi phía client
    if (!email || !password || !confirmedPassword || !name || !phone) return res.status(400).json({ 'message': 'Các trường đều phải được nhập' });

    // Kiểm tra password và confirmedPassword
    if (password !== confirmedPassword) {
        return res.status(400).json({ 'message': 'Mật khẩu không trùng khớp' });
    }

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 'message': 'Email đã được đăng ký' });
        }

        // XỬ LÝ TẠO TÀI KHOẢN NGÂN HÀNG TẠI ĐÂY 
        let token;
        try {
            const tokenResponse = await axios.post(`${process.env.DOMAIN_BANK}/request-server/generate-token`, {
                email: email
            }, { httpsAgent: agent }); // Public thì bỏ đi

            token = tokenResponse.data.token;
        } catch (axiosError) {
            console.error('Error generating token:', axiosError.message);
            return res.status(502).json({ message: 'Không thể tạo token cho tài khoản ngân hàng' });
        }

        const data = { email };

        try {
            const response = await axios.post(`${process.env.DOMAIN_BANK}/request-server/register`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Thêm token vào header
                    'Content-Type': 'application/json'
                },
                httpsAgent: agent // Public thì bỏ đi
            });

            if (!response.data.success) {
                console.error('Lỗi khi đăng ký tài khoản thanh toán');
                return res.status(502).json({ message: 'Không thể tạo tài khoản ngân hàng' });
            }
        } catch (axiosError) {
            console.error('Lỗi khi đăng ký tài khoản thanh toán:', axiosError.message);
            return res.status(502).json({ message: 'Không thể tạo tài khoản thanh toán' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = 1;
        const newUser = await userModel.createUser(email, name, phone, userRole, hashedPassword);
        res.status(201).json({ success: 'Tài khoản và tài khoản ngân hàng đã được tạo thành công' });
    } catch (error) {
        console.error('Error: ', error.message);
    }
}

module.exports = { handleNewUser };
