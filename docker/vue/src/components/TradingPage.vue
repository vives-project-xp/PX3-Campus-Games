<template>
  <div class="container">
    <!-- QR Code and Scanner Section -->
    <div v-if="!tradeJoined" class="qr-scan-section">
      <div class="qr-display">
        <div v-if="qrCodeUrl" class="qr-section">
          <img :src="qrCodeUrl" alt="Scan deze qr code om een sessie te starten">
        </div>
        <div v-else class="qr-section placeholder">
          <p>QR Code</p>
        </div>
      </div>

      <div class="scanner-section">
  <div class="video-container">
    <video ref="videoElement" class="video" autoplay playsinline style="display: none;"></video>
    <div v-if="!isScanning" class="video-placeholder">
      <p>klik op "scan een qrcode" om te scannen</p>
    </div>
  </div>
</div>

      <!-- Buttons arranged vertically and centered -->
      <div class="buttons-container">

        <button
          class="btn"
          @click="generateQRCode"
          :disabled="qrGenerated"
          :class="{ 'btn-disabled': qrGenerated }"
        >Maak een QR Code aan
        </button>

        <button class="btn" @click="startScanning">Scan QR Code</button>
      </div>
    </div>

    <!-- Trading Interface -->
    <div v-if="tradeJoined" class="trade-area">
      <div class="cards-container">
        <!-- Your Card Selection -->
        <div class="card-box" @click="openCardSelection">
          <h3>Jouw keuze</h3>
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
            <p>Geen kaart geselecteerd</p>
          </div>
        </div>

        <!-- Friend's Card -->
        <div class="card-box">
          <h3>Andere speler</h3>
          <PlayingCard
            v-if="friendCard"
            :cardName="friendCard.cardName"
            :cardImage="friendCard.artwork_path"
            :attack="friendCard.attack"
            :ability="friendCard.ability"
            :health="friendCard.health"
            :isSelected="false"
          />
          <p v-else>wachten op een keuze...</p>
        </div>
      </div>

      <!-- Rest of your trading interface -->
      <div class="accept-trade-container">

        <button class="btn" :disabled="hasAccepted" @click="acceptTrade">
          {{ hasAccepted ? "Ge-accepteerd" : "Accepteer" }}
        </button>
        <p v-if="showSelectCardMessage">Selecteer eerst een kaart</p>

        <p v-if="friendAccepted && hasAccepted">Beide spelers hebben ge-accepteerd!</p>
      </div>
    </div>

    <!-- Card Selection Modal -->
    <div v-if="showCardSelection" class="modal">
      <div class="modal-content">
        <h2>Selecteer een kaart</h2>
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
          <div class="no-cards" v-if="filteredCards.length === 0">Geen kaarten gevonden.</div>
        </div>
        <button class="btn close-btn" @click="showCardSelection = false">Sluit</button>
      </div>
    </div>

    <!-- New Card Popup -->
    <div v-if="showNewCardPopup" class="new-card-popup modal">
      <div class="modal-content">
        <h2>nieuwe kaart:</h2>
        <PlayingCard
          v-if="receivedCard"
          :cardName="receivedCard.cardName"
          :cardImage="receivedCard.artwork_path"
          :attack="receivedCard.attack"
          :ability="receivedCard.ability"
          :health="receivedCard.health"
          :isSelected="false"
        />
        <div class="popup-buttons">
          <button class="btn" @click="closePopup">Sluit</button>
          <button class="btn" @click="viewCollection">Bekijk in je collectie!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
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
    const qrGenerated = ref(false);
    const scanner = ref(null);
    const isScanning = ref(false);
    const tradeJoined = ref(false);
    const userId = ref(localStorage.getItem('userId'));
    const userCards = ref([]);
    const selectedCard = ref(null);
    const showSelectCardMessage = ref(false);
    const friendCard = ref(null);
    const showCardSelection = ref(false);
    const searchQuery = ref('');
    const hasAccepted = ref(false);
    const friendAccepted = ref(false);
    
    const showNewCardPopup = ref(false);
    const receivedCard = ref(null);
    
    const router = useRouter();
    const socket = io(API_URL);

    const filteredCards = computed(() => {
      let filtered = userCards.value;
      if (searchQuery.value) {
        filtered = filtered.filter(card =>
          card.cardName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      console.log("Filtered Cards:", filtered);
      return filtered.map((card) => ({
        ...card,
        artwork_path: getImage(card.artwork_path),
      }));
    });

    const getImage = (fileName) => {
      if (!fileName) return "";
      try {
      
      
      return require(`@/assets${fileName}`);
      } catch (e) {
      console.error("Error loading image:", e);
      return ""; // Fallback als de afbeelding niet gevonden wordt
      }
    };

const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
      } else {
        router.push('/login');
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const generateQRCode = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/startTrade`);
        tradeCode.value = response.data.tradeCode;

        await axios.post(`${API_URL}/api/joinTrade`, {
          tradeCode: tradeCode.value,
          userId
        });

        qrGenerated.value = true;
        qrCodeUrl.value = await QRCode.toDataURL(tradeCode.value);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const startScanning = () => {
  const videoElem = document.querySelector('.video'); // Use existing video element
  const videoContainer = document.querySelector('.video-container');
  
  isScanning.value = true;

  // Style the video to fill the container while maintaining aspect ratio
  videoElem.style.objectFit = 'cover';
  videoElem.style.width = '100%';
  videoElem.style.height = '100%';
  
  if (!scanner.value) {
    scanner.value = new QrScanner(
      videoElem,
      (result) => {
        console.log("Scanned Trade Code:", result.data);
        joinTrade(result.data);
        scanner.value.stop();
        isScanning.value = false; // Reset scanning state
      },
      { 
        returnDetailedScanResult: true,
        preferredCamera: 'environment', // Use rear camera if available
        highlightScanRegion: true, // Visual feedback for scanning
        highlightCodeOutline: true, // Highlight detected QR codes
      }
    );
  }
  
  // Make sure video is visible
  videoElem.style.display = 'block';
  scanner.value.start();
};

const joinTrade = async (code) => {
  try {
    socket.emit('register', String(userId.value)); // Register socket before joining
    await axios.post(`${API_URL}/api/joinTrade`, { tradeCode: code, userId: String(userId.value) });
    tradeCode.value = code;
    startPollingForTrade(); // Always poll until both users are present
  } catch (error) {
    console.error("Error joining trade:", error);
  }
};

    const loadUserCards = async () => {
  try {
      console.log("Fetching user cards for userId:", userId.value);
      const response = await axios.get(`${API_URL}/api/userCards/${userId.value}`);
      console.log("API Response:", response.data);
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
          userId: userId.value,
          card: card
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
  // Add this validation check FIRST
  if (!selectedCard.value) {
    showSelectCardMessage.value = true; // Show message
    console.log("show no card selected");
    setTimeout(() => {
      showSelectCardMessage.value = false; // Hide after 5 sec
      console.log("hide no card selected");
    }, 5000);
    return; // Exit early
  }

  console.log("continuing accept trade");

  // Then proceed with the existing trade logic
  try {
    const response = await axios.post(`${API_URL}/api/acceptTrade`, {
      tradeCode: tradeCode.value,
      userId: userId.value
    });
    hasAccepted.value = true;

    // Rest of your existing code...
    if (response.data.tradeStatus.user1Accepted && response.data.tradeStatus.user2Accepted) {
      if (response.data.tradeStatus.user1 === userId) {
        receivedCard.value = response.data.tradeStatus.user2Card;
      } else {
        receivedCard.value = response.data.tradeStatus.user1Card;
      }
      showNewCardPopup.value = true;
    } else {
      if (response.data.tradeStatus.user1 === userId) {
        friendAccepted.value = response.data.tradeStatus.user2Accepted;
      } else {
        friendAccepted.value = response.data.tradeStatus.user1Accepted;
      }
    }

    await fetchTradeUpdates();

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
    // ...rest of your update logic
  } catch (error) {
    console.error("Error fetching trade updates:", error);
  }
};

const deleteTrade = async () => {

console.log("Sending:", {
tradeCode: tradeCode.value,
userId: userId.value
});


try {
  await fetch(`${API_URL}/api/exitTrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tradeCode: tradeCode.value,
      userId: userId.value,
    }),
  });
} catch (err) {
  console.error("exitTrade failed:", err);
}
};

    // Popup functionality: refresh the page or navigate to collection
    const closePopup = () => {
      window.location.reload();
    };

    const viewCollection = () => {
      router.push('/collection');
    };

    let pollInterval = null;

const startPollingForTrade = () => {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(async () => {
    await fetchTradeUpdates();
    // Only stop polling when both users are present
    if (tradeJoined.value) clearInterval(pollInterval);
  }, 1000);
};

    onMounted(() => {
  window.addEventListener("beforeunload", deleteTrade);
  checkLoginStatus();
  socket.emit('register', String(userId.value));
  loadUserCards();

  // Always start polling if not joined
  if (!tradeJoined.value) {
    startPollingForTrade();
  }

  socket.on('tradeUpdated', (data) => {
    if (data.tradeCode === tradeCode.value) {
      fetchTradeUpdates();
    }
  });
});

// delete a trade when leaving/re-loading the page
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", deleteTrade);
});

    return {
      deleteTrade,
      tradeCode,
      qrCodeUrl,
      qrGenerated,
      tradeJoined,
      userCards,
      selectedCard,
      friendCard,
      showSelectCardMessage,
      showCardSelection,
      searchQuery,
      filteredCards,
      clearSearch,
      generateQRCode,
      startScanning,
      openCardSelection,
      selectCard,
      acceptTrade,
      showNewCardPopup,
      receivedCard,
      closePopup,
      viewCollection,
      friendAccepted,
      hasAccepted
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
  padding: 3rem 0rem 0rem 0rem;
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
  width: 12.5rem;
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* black half transparent */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Content for New Card Popup */
.modal-content {
  background: #fff;
  border-radius: 0.75rem;
  width: 90%;  /* default for smaller screens */
  max-width: 400px; /* ensures proper scaling on mobile devices */
  padding: 1rem;
  margin: auto;
  max-height: 90%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Ensure the card image stays nicely inside the modal content */
.card-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
}

/* New Card Popup specific styles */
.new-card-popup .modal-content {
  text-align: center;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.accept-trade-container p {
    height: 2rem;
    color: red;
    text-align: center;
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
  width: 4rem;
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

.btn-disabled {
  background-color: #a0a0a0;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 0.5;
}


/* Close Button for Modal */
.close-btn {
  position: sticky;
  bottom: 0;
  align-self: center;
  margin-top: 1rem;
}

.video-container {
  position: relative;
  width: 100%;
  width: 12.5rem;
  height: 12.5rem;
  margin: 0rem 0rem 1.5rem 0rem;
  background-color: black;
  border-radius: 0.75rem;
  overflow: hidden;
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* This ensures the video fills the container while maintaining aspect ratio */
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
}

/* ////////////////////////////////////////////////////////////////// */



/* ////////////////////////////////////////////////////////////////// */

@media (min-width: 768px) {
  .modal-content[data-v-6b7e1cb6] {
    width: 30%; /* adjust width for laptops/desktops */
    max-width: none;
  }
}

/* Responsive adjustments */
@media (max-width: 30rem) {
  .cards-container {
    flex-direction: column;
  }
}
</style>
