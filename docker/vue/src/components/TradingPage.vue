<template>
  <div class="container">
    <!-- QR Code and Scanner Section -->
    <div v-if="!tradeJoined" class="qr-scan-section">
      <div class="qr-display">
        <div v-if="qrCodeUrl" class="qr-section">
          <img :src="qrCodeUrl" alt="Scan this QR code to join the trade">
        </div>
        <div v-else class="qr-section placeholder">
          <p>QR Code</p>
        </div>
      </div>
      <!-- Buttons arranged vertically and centered -->
      <div class="buttons-container">
        <button class="btn" @click="generateQRCode">Generate QR Code</button>
        <button class="btn" @click="startScanning">Scan QR Code</button>
      </div>
      <!-- Hidden video element used for scanning -->
      <div class="scanner-section">
        <video ref="videoElement" class="video"></video>
      </div>
    </div>

    <!-- Trading Interface -->
    <div v-if="tradeJoined" class="trade-area">
      <div class="cards-container">
        <!-- Your Card Selection -->
    <!-- Trading Interface -->
    <div v-if="tradeJoined" class="trade-area">
      <div class="cards-container">
<!-- Your Card Selection -->
<div class="card-box" @click="openCardSelection">
  <h3>Your Selection</h3>
  <PlayingCard
    v-if="selectedCard"
    :cardName="selectedCard.cardName"
    :cardImage="selectedCard.artwork_path"
    :attack="selectedCard.attack"
    :ability="selectedCard.ability"
    :health="selectedCard.health"
    :isSelected="true"
  />
  <div v-else class="card-placeholder">
    <p>No Card Selected</p>
  </div>
</div>

<!-- Friend's Card -->
<div class="card-box">
  <h3>Friend's Selection</h3>
  <PlayingCard
    v-if="friendCard"
    :cardName="friendCard.cardName"
    :cardImage="friendCard.artwork_path"
    :attack="friendCard.attack"
    :ability="friendCard.ability"
    :health="friendCard.health"
    :isSelected="false"
  />
  <p v-else>Waiting for selection...</p>
</div>

      </div>
      <!-- Rest of your trading interface -->
    </div>
      </div>

      <!-- Accept Trade Button and Status -->
      <div class="accept-trade-container">
        <button class="btn" :disabled="hasAccepted" @click="acceptTrade">
          {{ hasAccepted ? "Trade Accepted" : "Accept Trade" }}
        </button>
        <p v-if="friendAccepted && hasAccepted">Both players have accepted the trade!</p>
      </div>
    </div>

    <!-- Card Selection Modal -->
    <div v-if="showCardSelection" class="modal">
      <div class="modal-content">
        <h2>Select a Card</h2>

        <!-- Search Input -->
        <div class="search-input">
          <input type="text" v-model="searchQuery" placeholder="Search cards..." />
          <button @click="clearSearch">x</button>
        </div>

        <!-- Scrollable Card Grid -->
        <div class="card-container">
          <div class="card-grid">
            <PlayingCard
              v-for="card in filteredCards"
              :key="card.card_id"
              :cardName="card.cardName"
              :cardImage="card.artwork_path"
              :attack="card.attack"
              :ability="card.ability"
              :health="card.health"
              :isSelected="selectedCard && selectedCard.card_id === card.card_id"
              @click="selectCard(card)"
            />
          </div>
          <div class="no-cards" v-if="filteredCards.length === 0">No cards found.</div>
        </div>

        <button class="btn close-btn" @click="showCardSelection = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { ref, computed, onMounted } from 'vue';
import axios from "axios";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";
import { io } from 'socket.io-client';
import { API_URL } from "../config";

export default {
  components: { PlayingCard },
  setup() {
    const tradeCode = ref(null);
    const qrCodeUrl = ref(null);
    const scanner = ref(null);
    const tradeJoined = ref(false);
    const userId = localStorage.getItem('userId');
    const userCards = ref([]);
    const selectedCard = ref(null);
    const friendCard = ref(null);
    const showCardSelection = ref(false);
    const searchQuery = ref('');
    const hasAccepted = ref(false);
    const friendAccepted = ref(false);

    const socket = io(API_URL);

    const filteredCards = computed(() => {
  let filtered = userCards.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(card =>
      card.cardName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered.map((card) => ({
    ...card,
    artwork_path: getImage(card.artwork_path), // Ensure the correct path is set
  }));
});

// Function to correctly resolve image paths
const getImage = (fileName) => {
  try {
    return require(`@/assets/Cards/${fileName.split('/').pop()}`);
  } catch (error) {
    console.error("Image not found:", fileName);
    return "";
  }
};

// const selectedCardImage = computed(() => {
//   return selectedCard.value
//     ? getImage(selectedCard.value.artwork_path)
//     : "";
// });

// const friendCardImage = computed(() => {
//   return friendCard.value
//     ? getImage(friendCard.value.artwork_path)
//     : "";
// });

  //   const selectedCardImage = computed(() => {
  //   return selectedCard.value
  //     ? require(`@/assets/Cards/${selectedCard.value.artwork_path.split('/').pop()}`)
  //     : '';
  // });

  // const friendCardImage = computed(() => {
  //   return friendCard.value
  //     ? require(`@/assets/Cards/${friendCard.value.artwork_path.split('/').pop()}`)
  //     : '';
  // });

    const clearSearch = () => {
      searchQuery.value = '';
    };

    // // Helper to update image paths from "/Cards" to "/img"
    // const replacePath = (path) => {
    //   return path.replace('/Cards', '/img');
    // };

    // const getImage = (fileName) => {
    //   try {
    //     // fileName is expected to be something like "Softwaredev_Tech.png"
    //     return require(`@/Cards/${fileName}`);
    //   } catch (error) {
    //     console.error("Image not found:", fileName);
    //     return "";
    //   }
    // };

    const generateQRCode = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/startTrade`);
        tradeCode.value = response.data.tradeCode;

        await axios.post(`${API_URL}/api/joinTrade`, {
          tradeCode: tradeCode.value,
          userId
        });

        qrCodeUrl.value = await QRCode.toDataURL(tradeCode.value);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const startScanning = () => {
      const videoElem = document.createElement('video');
      document.body.appendChild(videoElem);

      if (!scanner.value) {
        scanner.value = new QrScanner(
          videoElem,
          (result) => {
            console.log("Scanned Trade Code:", result.data);
            joinTrade(result.data);
            scanner.value.stop();
          },
          { returnDetailedScanResult: true }
        );
      }
      scanner.value.start();
    };

    const joinTrade = async (code) => {
      try {
        await axios.post(`${API_URL}/api/joinTrade`, { tradeCode: code, userId });
        tradeCode.value = code;
        await fetchTradeUpdates();
      } catch (error) {
        console.error("Error joining trade:", error);
      }
    };

    const loadUserCards = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/userCards/${userId}`);
        userCards.value = response.data;
      } catch (error) {
        console.error("Error loading user cards:", error);
      }
    };

    const openCardSelection = () => {
      showCardSelection.value = true;
    };

    const selectCard = async (card) => {
      selectedCard.value = card;
      showCardSelection.value = false;
      try {
        const response = await axios.post(`${API_URL}/api/selectCard`, {
          tradeCode: tradeCode.value,
          userId,
          card
        });
        if (response.data.tradeStatus) {
          if (response.data.tradeStatus.user1 === userId) {
            friendCard.value = response.data.tradeStatus.user2Card;
          } else {
            friendCard.value = response.data.tradeStatus.user1Card;
          }
        }
      } catch (error) {
        console.error("Error selecting card:", error);
      }
    };

    const acceptTrade = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/acceptTrade`, {
          tradeCode: tradeCode.value,
          userId
        });
        hasAccepted.value = true;
        if (response.data.tradeStatus.user1Accepted && response.data.tradeStatus.user2Accepted) {
          console.log("Both users have accepted the trade.");
        }
        if (response.data.tradeStatus.user1 === userId) {
          friendAccepted.value = response.data.tradeStatus.user2Accepted;
        } else {
          friendAccepted.value = response.data.tradeStatus.user1Accepted;
        }
        console.log(response.data.message);
      } catch (error) {
        console.error("Error accepting trade:", error);
      }
    };

    const fetchTradeUpdates = async () => {
      if (!tradeCode.value) return;
      try {
        const response = await axios.get(`${API_URL}/api/getTradeStatus/${tradeCode.value}`);
        if (response.data.user1 && response.data.user2) {
          tradeJoined.value = true;
        }
        if (response.data.notifyUser === userId) {
          console.log("Notified to update trade status!");
          tradeJoined.value = true;
        }
        if (response.data.user1 === userId) {
          friendCard.value = response.data.user2Card;
        } else {
          friendCard.value = response.data.user1Card;
        }
      } catch (error) {
        console.error("Error fetching trade updates:", error);
      }
    };

    onMounted(() => {
      socket.emit('register', userId);
      loadUserCards();
      fetchTradeUpdates();
      socket.on('tradeUpdated', (data) => {
        if (data.tradeCode === tradeCode.value) {
          console.log("Received real-time trade update!");
          fetchTradeUpdates();
        }
      });
    });

    return {
      tradeCode,
      qrCodeUrl,
      tradeJoined,
      userCards,
      selectedCard,
      friendCard,
      showCardSelection,
      searchQuery,
      filteredCards,
      clearSearch,
      generateQRCode,
      startScanning,
      openCardSelection,
      selectCard,
      acceptTrade,
      //selectedCardImage,
      //friendCardImage // Return it so it's available in the template
    };
  }
};
</script>

<style scoped>
/* Container and Global Layout */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  gap: 2rem;
  text-align: center;
}

/* QR Code and Scanner Section */
.qr-scan-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.qr-display {
  width: 12.5rem; /* fixed size: 200px/16 */
  height: 12.5rem;
}

.qr-section {
  width: 100%;
  height: 100%;
  border: 0.125rem dashed #aaa;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.qr-section.placeholder p {
  font-size: 1rem;
  color: #666;
}

/* Buttons Container - arranged vertically */
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* Hide the video element by default */
.scanner-section .video {
  display: none;
}

/* Trading Interface */
.trade-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

/* Cards container: your card left, friend’s card right */
.cards-container {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
}

.card-box {
  flex: 1;
  padding: 1rem;
  border: 0.125rem solid #333;
  border-radius: 0.75rem;
  cursor: pointer;
  background: #f9f9f9;
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card Placeholder styling to maintain layout consistency */
.card-placeholder {
  width: 10rem;
  height: 14rem;
  border: 0.125rem dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #999;
}

/* Accept Trade Section */
.accept-trade-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Card Selection Modal Overlay */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 90%;
  height: 90%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

/* Search Input */
.search-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input input {
  padding: 0.5rem;
  flex: 1;
  font-size: 1rem;
}

/* Card Grid */
.card-container {
  flex: 1;
  overflow-y: auto;
}

.playing-card img {
  width: 4rem; /* Set a smaller width */
  height: auto;
  max-width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  gap: 1rem;
}

/* Buttons */
.btn {
  padding: 0.8rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

/* Close Button for Modal */
.close-btn {
  position: sticky;
  bottom: 0;
  align-self: center;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 30rem) {
  .cards-container {
    flex-direction: column;
  }
}
</style>
