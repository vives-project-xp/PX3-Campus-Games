<template>
    <div class="starter-pack-container">
        <h2>Starter Pack</h2>
        <button @click="claimStarterPack">Claim Starter Pack</button>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
    data() {
        return {
            errorMessage: '',
        };
    },
    methods: {
        async claimStarterPack() {
            this.errorMessage = '';
            try {
                const userId = 1; // Replace with actual user ID
                const response = await axios.post(`${API_URL}/api/starter-pack`, { userId });
                alert(response.data.message);
                this.$router.push('/collection');
            } catch (error) {
                this.errorMessage = error.response?.data?.error || 'An error occurred while claiming the starter pack.';
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
</style>