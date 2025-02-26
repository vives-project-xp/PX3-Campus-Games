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
import axios from 'axios';

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
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await axios.post('http://localhost:3001/api/users/register', { // test met postman en volledige url
          username: this.username,
          opleiding: this.opleiding,
          password: this.password,
        });
        this.successMessage = response.data.message;
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