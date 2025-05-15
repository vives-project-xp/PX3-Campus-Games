<template>
  <div class="starter-pack-container">
    <h2>Starter Pack</h2>
    <button
      @click="handleClaimButtonClick"
      :disabled="hasCards || isLoading"
      class="reward-button"
    >
      <img
        v-if="!isLoading"
        src="@/assets/cardpack.png"
        alt="Claim Starter Pack"
        class="card-pack-image"
      />
      <span v-if="isLoading">Laden...</span>
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
      const userId = localStorage.getItem('userId');
      if (!userId) {
          return;
      }

      try {
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
       const userId = localStorage.getItem('userId'); // Replace with actual user ID
        if (!userId) {
            this.message = 'User not logged in or ID not found.';
            this.isError = true;
            this.isLoading = false;
            this.$router.push('/login');
            return;
        }
      try {

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
         if (error.response?.status === 401 || error.response?.status === 403) {
             this.$router.push('/login');
         }
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

/* Claim button styling */
.reward-button {
  background: none; /* Remove default background */
  border: none; /* Remove border */
  padding: 0; /* Remove padding */
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: 1rem; /* Keep margin top */
  display: inline-block; /* Ensure image behaves like inline */
}

.reward-button:hover {
  opacity: 0.8;
}

.reward-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-pack-image {
  width: 150px; /* Adjust size as needed */
  height: auto;
  display: block; /* Prevent extra space below image */
}

.reward-button span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

</style>