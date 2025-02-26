const { defineConfig } = require('@vue/cli-service');
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
    port: 8080,
    host: 'localhost',
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'https://website-bookstore.onrender.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0]['process.env'].VUE_APP_API_URL = JSON.stringify(
        process.env.VUE_APP_API_URL || 'https://website-bookstore.onrender.com'
      );
      return definitions;
    });
  }
});
