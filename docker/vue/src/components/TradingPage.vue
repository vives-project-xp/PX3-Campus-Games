<template>
    <div class="trading-page">
      <h1>Card Trading</h1>
  
      <!-- Temporary cheat button to add cards -->
      <button @click="addCheatCards" class="cheat-button">Add Cheat Cards</button>
  
      <div class="players">
        <!-- Player 1's card selection -->
        <div class="player">
          <h2>Your Cards</h2>
          <div v-if="player1Cards.length === 0">You don't have any cards yet!</div>
          <div class="card-container">
            <div
              v-for="card in player1Cards"
              :key="card.card_id"
              class="card"
              :class="{'selected': player1SelectedCard && player1SelectedCard.card_id === card.card_id}"
              @click="selectCard(1, card)"
            >
              <img :src="card.image" alt="Card" />
              <p>{{ card.name }}</p>
            </div>
          </div>
        </div>
  
        <!-- Player 2's card selection -->
        <div class="player">
          <h2>Friend's Cards</h2>
          <div v-if="player2Cards.length === 0">Your friend doesn't have any cards yet!</div>
          <div class="card-container">
            <div
              v-for="card in player2Cards"
              :key="card.card_id"
              class="card"
              :class="{'selected': player2SelectedCard && player2SelectedCard.card_id === card.card_id}"
              @click="selectCard(2, card)"
            >
              <img :src="card.image" alt="Card" />
              <p>{{ card.name }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="player1SelectedCard && player2SelectedCard">
        <h3>Your Selected Card: {{ player1SelectedCard.name }}</h3>
        <h3>Friend's Selected Card: {{ player2SelectedCard.name }}</h3>
      </div>
  
      <div v-if="player1SelectedCard && player2SelectedCard">
        <button @click="acceptTrade" class="accept-trade">Accept Trade</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { API_URL } from '../config';
  
  export default {
    data() {
      return {
        player1Cards: [],
        player2Cards: [],
        player1SelectedCard: null,
        player2SelectedCard: null,
        player1Id: 1, // Replace with actual player 1 id
        player2Id: 2, // Replace with actual player 2 id
      };
    },
    mounted() {
      // Fetch player 1's and player 2's cards when the page loads
      this.fetchPlayerCards(1);
      this.fetchPlayerCards(2);
    },
    methods: {
      async fetchPlayerCards(player) {
        try {
          const response = await axios.get(`${API_URL}/api/userCards/${player === 1 ? this.player1Id : this.player2Id}`);
          if (player === 1) {
            this.player1Cards = response.data;
          } else {
            this.player2Cards = response.data;
          }
        } catch (error) {
          console.error("Error fetching cards:", error);
        }
      },
  
      selectCard(player, card) {
        if (player === 1) {
          this.player1SelectedCard = card;
        } else {
          this.player2SelectedCard = card;
        }
      },
  
      async acceptTrade() {
        if (this.player1SelectedCard && this.player2SelectedCard) {
          try {
            const tradePayload = {
              senderId: this.player1Id,
              receiverId: this.player2Id,
              senderCardId: this.player1SelectedCard.card_id,
              receiverCardId: this.player2SelectedCard.card_id,
            };
            const response = await axios.post(`${API_URL}/api/tradeCards`, tradePayload);
            alert(response.data.message);
            // Reload the cards to show the updated state
            this.fetchPlayerCards(1);
            this.fetchPlayerCards(2);
          } catch (error) {
            console.error("Error accepting trade:", error);
          }
        } else {
          alert("Please select a card to trade!");
        }
      },
  
      // Temporary cheat button to add cards to the database
      async addCheatCards() {
        try {
          await axios.post(`${API_URL}/api/addCard`, { user_id: this.player1Id, card_id: 1 });
          await axios.post(`${API_URL}/api/addCard`, { user_id: this.player1Id, card_id: 2 });
          await axios.post(`${API_URL}/api/addCard`, { user_id: this.player1Id, card_id: 3 });
          this.fetchPlayerCards(1); // Reload player 1's cards
        } catch (error) {
          console.error("Error adding cheat cards:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .trading-page {
    padding: 20px;
    text-align: center;
  }
  
  .cheat-button {
    margin-bottom: 20px;
  }
  
  .players {
    display: flex;
    justify-content: space-between;
  }
  
  .player {
    width: 45%;
  }
  
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .card {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    width: 120px;
    text-align: center;
    cursor: pointer;
  }
  
  .card.selected {
    border-color: #007bff;
    background-color: #f0f8ff;
  }
  
  .card img {
    max-width: 100%;
    height: auto;
  }
  
  .accept-trade {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .accept-trade:hover {
    background-color: #218838;
  }
  </style>
  