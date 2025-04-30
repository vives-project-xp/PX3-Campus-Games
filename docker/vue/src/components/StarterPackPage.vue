<template>
  <div class="starter-pack-container">
    <h2>Starter Pack</h2>
    <button
      @click="handleClaimButtonClick"
      :disabled="hasCards"
      class="reward-button"
    >
      <span v-if="isLoading">Laden...</span>
      <span v-else>{{ hasCards ? 'Starter Pack Claimed' : 'Claim Starter Pack' }}</span>
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
      isLoading: false,
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
      this.isLoading = true;
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
      } finally {
        this.isLoading = false;
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

/* Styling for the button to match the daily reward button */
.reward-button {
  background-color: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem; /* Added margin top to separate from the title */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.reward-button:hover {
  background-color: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.reward-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>