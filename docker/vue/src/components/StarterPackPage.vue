<template>
    <div class="starter-pack-container">
        <div class="spacer"></div>
        <div class="logo-placeholder">Logo Here</div>

        <h2>Welkom, {{ username }}</h2>

        <button @click="openStarterPack" class="open-button">OPEN Starter Pack</button>

        <div class="cards-container" v-if="cards.length > 0">
            <h3>Ontvangen Kaarten:</h3>
            <ul>
                <li v-for="card in cards" :key="card.card_id">{{ card.name }}</li>
            </ul>
        </div>

        <div class="error-space" v-if="errorMessage">{{ errorMessage }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: localStorage.getItem('username') || '',
            cards: [],
            errorMessage: '',
        };
    },
    methods: {
        async openStarterPack() {
            this.errorMessage = '';
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.post('http://localhost:3000/api/starter-pack', { userId });
                this.cards = response.data.cards;
                alert('Starter pack geopend!');
            } catch (error) {
                this.errorMessage = error.response?.data?.error || 'Er is een error opgetreden tijdens het openen van het starter pack.';
            }
        }
    },
    mounted() {
        this.username = localStorage.getItem('username');
    }
};
</script>

<style scoped>
.starter-pack-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: auto;
}

.spacer {
    height: 4rem;
}

.logo-placeholder {
    width: 90%;
    max-height: 50vh;
    background-color: lightgray;
    text-align: center;
    padding: 4rem 1rem 4rem 1rem;
    margin-bottom: 2rem;
}

.open-button {
    width: 100%;
    padding: 1.5rem;
    background-color: green;
    color: white;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    margin-bottom: 2rem;
}

.cards-container {
    width: 100%;
    margin-top: 2rem;
}

.error-space {
    height: 2rem;
    color: red;
    text-align: center;
}
</style>