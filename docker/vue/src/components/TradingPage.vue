<template>
    <div class="trading-container">
      <h2>Trade Your Cards</h2>
      <div v-if="!tradeCode">
        <button @click="generateTradeCode">Generate Trade QR Code</button>
        <p v-if="qrCode">Scan this QR Code: {{ qrCode }}</p>
      </div>
      
      <div v-else class="trade-section">
        <div class="card-selection">
          <h3>Your Card</h3>
          <select v-model="selectedCard" @change="updateTrade">
            <option v-for="card in userCards" :key="card.id" :value="card.id">
              {{ card.name }}
            </option>
          </select>
        </div>
        <div class="card-selection">
          <h3>Friend's Card</h3>
          <p v-if="friendSelectedCard">Selected: {{ friendSelectedCard.name }}</p>
        </div>
        <div class="trade-actions">
          <button @click="acceptTrade" :disabled="!selectedCard || !friendSelectedCard">Accept Trade</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        tradeCode: null,
        qrCode: null,
        userCards: [],
        selectedCard: null,
        friendSelectedCard: null,
      };
    },
    methods: {
      async generateTradeCode() {
        this.qrCode = Math.random().toString(36).substr(2, 10).toUpperCase();
        this.tradeCode = this.qrCode;
      },
      async updateTrade() {
        await axios.post('/api/updateTradeSelection', { tradeCode: this.tradeCode, cardId: this.selectedCard });
      },
      async acceptTrade() {
        await axios.post('/api/acceptTrade', { tradeCode: this.tradeCode });
      }
    },
  };
  </script>
  
  <style scoped>
  .trading-container {
    text-align: center;
  }
  .card-selection {
    margin: 20px;
  }
  </style>
  