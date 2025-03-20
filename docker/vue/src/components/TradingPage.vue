<template>
    <div class="trading-page">
      <h1>Trade Cards</h1>
      <div v-if="!qrScanned">
        <p>Deel deze SQ code om te kunnen traden</p>
        <qrcode-vue :value="qrCode" :size="200" level="H" />
        <p>Code: {{ qrCode }}</p>
      </div>
      <div v-else>
        <div class="cards-container">
          <div class="user-card">
            <h2>Jou kaarten:</h2>
            <button @click="addTestCard(userId)">Voeg een test kaar toe</button>
            <ul>
              <li v-for="card in userCards" :key="card.card_id" @click="selectCard(card, 'user')">
                {{ card.name }} (x{{ card.quantity }})
              </li>
            </ul>
            <p>Geselecteerd: {{ selectedUserCard?.name || 'None' }}</p>
          </div>
          <div class="friend-card">
            <h2>Kaart van andere</h2>
            <button @click="addTestCard(friendId)">Voeg een test kaart toe</button>
            <ul>
              <li v-for="card in friendCards" :key="card.card_id" @click="selectCard(card, 'friend')">
                {{ card.name }} (x{{ card.quantity }})
              </li>
            </ul>
            <p>Geselecteerd: {{ selectedFriendCard?.name || 'None' }}</p>
          </div>
        </div>
        <div class="trade-actions">
          <button :disabled="!selectedUserCard || !selectedFriendCard" @click="confirmTrade">Accepteer</button>
          <p v-if="tradeAccepted">Wachten voor andere om te accepteren...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import QrcodeVue from 'qrcode.vue';
  
  export default {
    components: { QrcodeVue },
    data() {
      return {
        qrCode: this.generateCode(),
        qrScanned: false,
        userCards: [],
        friendCards: [],
        selectedUserCard: null,
        selectedFriendCard: null,
        tradeAccepted: false,
        userId: 0, // Testing
        friendId: 1, // Testing
      };
    },
    methods: {
      generateCode() {
        return Math.random().toString(36).substring(2, 12);
      },
      async fetchCards() {
        this.userCards = (await axios.get(`/api/cards/${this.userId}`)).data;
        this.friendCards = (await axios.get(`/api/cards/${this.friendId}`)).data;
      },
      async selectCard(card, type) {
        if (type === 'user') {
          this.selectedUserCard = card;
          await axios.post('/api/trade/select', { userId: this.userId, selectedCard: card.card_id });
        } else {
          this.selectedFriendCard = card;
          await axios.post('/api/trade/select', { userId: this.friendId, selectedCard: card.card_id });
        }
      },
      async confirmTrade() {
        this.tradeAccepted = true;
        await axios.post('/api/trade/accept', { userId: this.userId });
      },
      async addTestCard(userId) {
        const testCardId = 99; // Test card ID
        await axios.post('/api/cards/add', { user_id: userId, card_id: testCardId });
        this.fetchCards();
      }
    },
    mounted() {
      this.fetchCards();
    }
  };
  </script>
  
  <style scoped>
  .trading-page {
    text-align: center;
  }
  .cards-container {
    display: flex;
    justify-content: space-around;
  }
  .trade-actions {
    margin-top: 20px;
  }
  </style>
  