const { defineConfig } = require('@vue/cli-service')
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.join(__dirname, './sslkeys/key.pem')), // Đường dẫn tới private key
        cert: fs.readFileSync(path.join(__dirname, './sslkeys/cert.pem')), // Đường dẫn tới certificate
      },
    },
    port: 8080,  // Chạy trên cổng 8080 hoặc cổng bạn chọn
    host: 'localhost',
    allowedHosts: 'all', // Chấp nhận tất cả các hosts (có thể thay thế theo nhu cầu)

    proxy: {
      '/api': {  // Tất cả các yêu cầu bắt đầu với `/api` sẽ được chuyển tiếp
        target: 'https://website-bookstore.onrender.com', // Địa chỉ của backend (nếu backend của bạn chạy trên 8080)
        changeOrigin: true, // Đổi Origin trong request header
        pathRewrite: { '^/api': '' }, // Xóa `/api` trong URL trước khi gửi yêu cầu tới backend
      },
    },
  },
});
