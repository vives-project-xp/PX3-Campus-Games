const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: [
    // List any dependencies you want to transpile here
    // For example, if you have a dependency called 'some-library':
    // 'some-library'
  ]
});

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

module.exports = {
  devServer: {
    port: process.env.PORT, // start frontend on the port from .env
    host: 'localhost'
  },
};