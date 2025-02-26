const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  devServer: process.env.NODE_ENV === 'development' ? {
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.join(__dirname, './sslkeys/key.pem')), // Đường dẫn tới private key
        cert: fs.readFileSync(path.join(__dirname, './sslkeys/cert.pem')), // Đường dẫn tới certificate
      },
    },
    port: 8080,  // Cổng chạy localhost
    host: 'localhost',
    allowedHosts: 'all', // Chấp nhận tất cả các hosts

    proxy: {
      '/api': {
        target: 'https://website-bookstore.onrender.com', // Backend server
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  } : undefined, // Không có `devServer` khi chạy trên Vercel
});
