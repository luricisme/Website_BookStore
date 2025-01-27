// src/app/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DTB_BANK_USER, // Tên người dùng PostgreSQL
    host: process.env.DTB_BANK_HOST, // Địa chỉ máy chủ PostgreSQL
    database: process.env.DTB_BANK_DATABASE, // Tên cơ sở dữ liệu
    password: process.env.DTB_BANK_PASSWORD, // Mật khẩu truy cập
    port: process.env.DTB_BANK_PORT, // Cổng mặc định PostgreSQL
    ssl: {
        rejectUnauthorized: false, // Chấp nhận chứng chỉ tự ký
    },
});

module.exports = pool;