const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: [
    // List any dependencies you want to transpile here
    // For example, if you have a dependency called 'some-library':
    // 'some-library'
  ],
  devServer: {
    port: 8000, // Ensure the frontend runs on port 8000
    host: '0.0.0.0', // Allow access from outside the container
  },
});

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables