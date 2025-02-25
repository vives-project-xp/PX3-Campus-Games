<template>
  <div>
    <h2>Register</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="opleiding" placeholder="Opleiding" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for making HTTP requests

export default {
  data() {
    return {
      username: '',
      opleiding: '',
      password: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async register() {
      this.errorMessage = ''; // Clear previous error messages
      this.successMessage = ''; // Clear previous success messages
      try {
        const response = await axios.post('/api/users/register', { // Replace with your backend API endpoint
          username: this.username,
          opleiding: this.opleiding,
          password: this.password,
        });
        this.successMessage = response.data.message; // Display success message
        // Optionally, redirect to login or another page after successful registration
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error; // Display error message from backend
        } else {
          this.errorMessage = 'An error occurred during registration.'; // Generic error message
        }
      }
    },
  },
};
</script>