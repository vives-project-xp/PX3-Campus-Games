<template>
  <div class="container">
    <!-- QR Code and Scanner Section -->
    <div v-if="!tradeJoined">
      <button class="btn" @click="generateQRCode">Generate QR Code</button>
      <div v-if="qrCodeUrl" class="qr-section">
        <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Scan this QR code to join the trade">
        <p v-else>QR Code will appear here</p>
      </div>

      <div class="scanner-section">
        <video ref="videoElement" class="video"></video>
        <button class="btn" @click="startScanning">Scan QR Code</button>
      </div>
    </div>

    <!-- Trading Interface -->
    <div v-if="tradeJoined" class="trade-area">
      <!-- Your Card Selection -->
      <div class="card-box" @click="openCardSelection">
        <h3>Your Selection</h3>
        <img v-if="selectedCard" :src="selectedCard.artwork_path" :alt="selectedCard.cardName">
        <p v-else>Click to choose a card</p>
      </div>

      <!-- Friend's Card -->
      <div class="card-box">
        <h3>Friend's Selection</h3>
        <img v-if="friendCard" :src="friendCard.artwork_path" :alt="friendCard.cardName">
        <p v-else>Waiting for selection...</p>
      </div>
    </div>

    <!-- Card Selection Modal -->
    <div v-if="showCardSelection" class="modal">
      <div class="modal-content">
        <h2>Select a Card</h2>
        <div class="card-list">
          <div v-for="card in userCards" :key="card.card_id" class="card-item" @click="selectCard(card)">
            <img :src="card.artwork_path" :alt="card.cardName">
            <p>{{ card.cardName }}</p>
          </div>
        </div>
        <button class="btn close-btn" @click="showCardSelection = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";
import { API_URL } from "../config";

export default {
  data() {
    return {
      tradeCode: null,
      qrCodeUrl: null,
      scanner: null,
      tradeJoined: false,
      userId: "1", // Placeholder for user ID, replace with real user data
      userCards: [],
      selectedCard: null,
      friendCard: null,
      showCardSelection: false,
    };
  },
  methods: {
    async generateQRCode() {
      try {
        const response = await axios.post(`${API_URL}/api/startTrade`);
        this.tradeCode = response.data.tradeCode;
        this.qrCodeUrl = await QRCode.toDataURL(this.tradeCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    },

    startScanning() {
      const videoElem = this.$refs.videoElement;
      if (!videoElem) {
        console.error("Video element not found!");
        return;
      }

      if (!this.scanner) {
        this.scanner = new QrScanner(
          videoElem,
          (result) => {
            console.log("Scanned Trade Code:", result.data);
            this.joinTrade(result.data);
            this.scanner.stop();
          },
          { returnDetailedScanResult: true }
        );
      }

      this.scanner.start();
    },

    async joinTrade(tradeCode) {
    try {
        const response = await axios.post(`${API_URL}/api/joinTrade`, {
            tradeCode,
            userId: this.userId
        });

        this.tradeCode = tradeCode;

        if (response.data.user1 && response.data.user2) {
            this.tradeJoined = true;
            await this.loadUserCards();
        } else {
            console.log("Waiting for another player...");
        }
    } catch (error) {
        console.error("Error joining trade:", error);
    }
},


    async loadUserCards() {
      try {
        const response = await axios.get(`${API_URL}/api/getUserCards/${this.userId}`);
        this.userCards = response.data;
      } catch (error) {
        console.error("Error loading user cards:", error);
      }
    },

    openCardSelection() {
      this.showCardSelection = true;
    },

    async selectCard(card) {
      this.selectedCard = card;
      this.showCardSelection = false;

      try {
        await axios.post(`${API_URL}/api/selectCard`, { tradeCode: this.tradeCode, userId: this.userId, card });
      } catch (error) {
        console.error("Error selecting card:", error);
      }
    },

    async fetchTradeUpdates() {
    if (!this.tradeCode) return;

    try {
        const response = await axios.get(`${API_URL}/api/getTradeStatus/${this.tradeCode}`);
        if (response.data.user1 && response.data.user2) {
            this.tradeJoined = true;
            clearInterval(this.tradeUpdateInterval);
        }

        if (response.data.user1 === this.userId) {
            this.friendCard = response.data.user2Card;
        } else {
            this.friendCard = response.data.user1Card;
        }
    } catch (error) {
        console.error("Error fetching trade updates:", error);
    }
},

  },
  mounted() {
    this.tradeUpdateInterval = setInterval(this.fetchTradeUpdates, 3000);
},
beforeDestroy() {
    clearInterval(this.tradeUpdateInterval);
    if (this.scanner) {
        this.scanner.destroy();
    }
},

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  gap: 2rem;
  text-align: center;
}

/* QR Code Section */
.qr-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 2px dashed #aaa;
  border-radius: 12px;
  margin-top: 1rem;
}

.qr-section img {
  max-width: 100%;
  max-height: 100%;
}

.scanner-section {
  margin-top: 1rem;
}

/* Trading Interface */
.trade-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.card-box {
  width: 100%;
  padding: 1rem;
  border: 2px solid #333;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  background: #f9f9f9;
}

.card-box img {
  max-width: 120px;
  border-radius: 8px;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 90%;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.card-item {
  width: 100px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  transition: transform 0.2s;
}

.card-item:hover {
  transform: scale(1.1);
}

.card-item img {
  max-width: 100px;
  border-radius: 8px;
}

/* Buttons */
.btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 90%;
  max-width: 300px;
}

.btn:hover {
  background-color: #0056b3;
}

.close-btn {
  margin-top: 1rem;
}
</style>
