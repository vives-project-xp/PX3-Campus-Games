const { defineConfig } = require('@vue/cli-service');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

module.exports = defineConfig({
  transpileDependencies: [
    // List any dependencies you want to transpile here
    // For example, if you have a dependency called 'some-library':
    // 'some-library'
  ],
  devServer: {
    port: process.env.PORT || 8080, // start frontend on the port from .env or default to 8080
    host: 'localhost',
    proxy: {
      '/api': {
        target: `http://${process.env.API_HOST}:3000`,
        changeOrigin: true,
      },
    },
  },
});