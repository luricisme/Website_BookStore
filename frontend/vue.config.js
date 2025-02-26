const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  devServer: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://website-bookstore.onrender.com' // Backend khi deploy
          : 'http://localhost:8888', // Backend khi chạy local
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'process.env.VUE_APP_API_URL': JSON.stringify('https://website-bookstore.onrender.com'),
        })
      );
    }
  },
});
