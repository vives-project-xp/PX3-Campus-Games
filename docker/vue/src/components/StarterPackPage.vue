<template>
    <div class="starter-pack-container">
      <h2>Starter Pack</h2>
      <button @click="handleClaimButtonClick" :disabled="hasCards">
        {{ hasCards ? 'Starter Pack Claimed' : 'Claim Starter Pack' }}
      </button>
      <div v-if="message" :class="{'error-message': isError, 'info-message': !isError}">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_URL } from '../config';
  
  export default {
    data() {
      return {
        message: '',
        isError: false,
        hasCards: false,
      };
    },
    async mounted() {
      await this.checkIfUserHasCards();
    },
    methods: {
      async checkIfUserHasCards() {
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`${API_URL}/api/userCards/${userId}`);
          this.hasCards = response.data.length > 0;
        } catch (error) {
          console.error('Error fetching user cards:', error);
          this.message = 'Failed to check if you have cards.';
          this.isError = true;
        }
      },
      handleClaimButtonClick() {
        if (!this.hasCards) {
          this.claimStarterPack();
        } else {
          this.message = 'You have already claimed your starter pack!';
          this.isError = false;
          // Clear the message after a few seconds
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      },
      async claimStarterPack() {
        this.message = '';
        this.isError = false;
        try {
          const userId = localStorage.getItem('userId'); // Replace with actual user ID
          const response = await axios.post(`${API_URL}/api/starter-pack`, { userId });
          this.message = response.data.message;
          this.isError = false;
          this.hasCards = true; // Update the state after successful claim
          // Redirect after a short delay to allow the message to be seen
          setTimeout(() => {
            this.$router.push('/collection');
          }, 1500);
        } catch (error) {
          this.message = error.response?.data?.error || 'An error occurred while claiming the starter pack.';
          this.isError = true;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .starter-pack-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  
  .info-message {
    color: green;
    margin-top: 1rem;
  }
  </style>