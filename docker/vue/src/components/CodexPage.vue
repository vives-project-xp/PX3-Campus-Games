<template>
  <div class="codex">
    <h2 v-if="isCodexRoute" class="heading">Codex:</h2>

    <!-- Fixed Top Section -->
    <div class="fixed-container">
      <!-- Filter Buttons -->
      <div class="filter-box">
        <div class="filter-row">
          <button @click="sortCards('cardName')">Naam</button>
          <button @click="sortCards('rarity')">Zeldzaamheid</button>
          <button @click="sortCards('opleiding')">Opleiding</button>
        </div>
      </div>

      <!-- Search and Total Cards -->
      <div class="search-box">
        <div class="total-cards">
          <img src="@/assets/total_cards_icon.png" alt="Total Cards Icon" class="icon" />
          <span>{{ filteredCards.length }}</span>
        </div>
        <div class="search-input">
          <input type="text" v-model="searchQuery" placeholder="Zoek kaarten..." />
          <button @click="clearSearch">x</button>
        </div>
      </div>
    </div>

    <!-- Scrollable Card Grid -->
    <div class="card-container">
      <div class="card-grid" v-if="filteredCards && filteredCards.length > 0">
        <PlayingCard
          v-for="card in filteredCards"
          :key="card.card_id"
          :cardName="card.cardName"
          :cardImage="card.artwork_path"
          :attack="card.attack"
          :ability="card.ability"
          :health="card.health"
          :grayscale="!userCards.includes(card.card_id)"
          @click="showCardDetails(card)"
        />
      </div>
      <div v-else class="no-cards">Geen kaarten gevonden.</div>
    </div>

    <!-- Card Details -->
    <div v-if="selectedCard" class="card-detail-overlay" @click="closeCardDetails">
      <div class="card-detail">
        <img
          :src="selectedCard.artwork_path"
          :alt="selectedCard.cardName"
          class="card-detail-image"
          :class="{ grayscale: selectedCard.grayscale }"
        />

        <div v-if="showInfo" class="card-info-box">
          <p><strong>Naam:</strong> {{ selectedCard.cardName }}</p>
          <p><strong>Opleiding:</strong> {{ selectedCard.opleiding.charAt(0).toUpperCase() + selectedCard.opleiding.slice(1).replace(/&/g, ' & ') }}</p>
          <p><strong>Zeldzaamheid:</strong> {{ {'Common': 'Gewoon', 'Uncommon': 'Ongewoon', 'Rare': 'Zeldzaam', 'Ultra Rare': 'Uiterst Zeldzaam', 'Legendary': 'Legendarisch'}[selectedCard.rarity] }}</p>
          <p><strong>Levenspunten:</strong> {{ selectedCard.health }}</p>
          <p><strong>Vaardigheid:</strong> {{ selectedCard.attack }}</p>
          <p><strong>Kracht:</strong> {{ selectedCard.ability.charAt(0).toUpperCase() + selectedCard.ability.slice(1).replace(/_/g, ' ') }}</p>
          <p><strong>Info:</strong> {{ selectedCard.info }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { API_URL } from '../config';

export default {
  name: 'CodexPage',
  components: { PlayingCard },
  setup() {
    const route = useRoute();
    const allCards = ref([]);
    const userCards = ref([]);
    const searchQuery = ref('');
    const sortKey = ref(null);
    const sortDirection = ref(1); // 1 = ASC, -1 = DESC
    const selectedCard = ref(null);
    const showInfo = ref(false);

    const isCodexRoute = computed(() => route.path === '/codex');
    const rarityOrder = ['common', 'uncommon', 'rare', 'ultra rare', 'legendary'];

    const filteredCards = computed(() => {
      let filtered = allCards.value;

      if (searchQuery.value) {
        filtered = filtered.filter((card) =>
          card.cardName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortKey.value) {
        if (sortKey.value === 'rarity') {
          filtered.sort((a, b) => {
            const rarityA = a.rarity.toLowerCase();
            const rarityB = b.rarity.toLowerCase();
            const indexA = rarityOrder.indexOf(rarityA);
            const indexB = rarityOrder.indexOf(rarityB);
            return (indexA - indexB) * sortDirection.value;
          });
        } else {
          filtered.sort((a, b) => {
            let comparison = 0;
            if (a[sortKey.value] > b[sortKey.value]) comparison = 1;
            if (a[sortKey.value] < b[sortKey.value]) comparison = -1;
            return comparison * sortDirection.value;
          });
        }
      }

      return filtered.map((card) => ({
        ...card,
        artwork_path: require(`@/assets/Cards/${card.artwork_path.split('/').pop()}`),
      }));
    });

    const sortCards = (key) => {
      if (sortKey.value === key) {
        sortDirection.value *= -1; // Sort DESC
      } else {
        sortKey.value = key;
        sortDirection.value = 1; // Reset ASC
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const fetchAllCards = async () => {
      try {
        const response = await fetch(`${API_URL}/api/getCard_dex`);
        const data = await response.json();
        allCards.value = data;
      } catch (error) {
        console.error('Error fetching all cards:', error);
      }
    };

    const fetchUserCards = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${API_URL}/api/userCards/${userId}`);
        const data = await response.json();
        userCards.value = data.map((card) => card.card_id); // Only card IDs
      } catch (error) {
        console.error('Error fetching user cards:', error);
      }
    };

    const showCardDetails = (card) => {
      selectedCard.value = {
        ...card,
        grayscale: !userCards.value.includes(card.card_id),
      };
      showInfo.value = true;
    };

    const closeCardDetails = () => {
      selectedCard.value = null;
      showInfo.value = false;
    };

    onMounted(async () => {
      await fetchAllCards();
      await fetchUserCards();
    });

    return {
      isCodexRoute,
      filteredCards,
      searchQuery,
      clearSearch,
      sortCards,
      userCards,
      showCardDetails,
      selectedCard,
      closeCardDetails,
      showInfo,
    };
  },
};
</script>

<style scoped>
.codex {
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading {
  margin-top: 3.5rem;
  margin-bottom: 0.6rem;
}

.fixed-container {
  margin-top: 0rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered Filters */
.filter-box {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 20rem;
}

.filter-row {
  display: flex;
  gap: 0.5rem;
}

.filter-row button {
  padding: 0.5rem 0.5rem;
  margin: 0.5rem 0rem;
  cursor: pointer;
  border: none;
  border-radius: 0.3rem;
  background-color: white;
  color: rgb(32, 32, 32);
  transition: background-color 0.2s, color 0.3s;
  font-size: 1rem;
}

.filter-row button.active {
  background-color: red;
  color: white;
}

.total-cards {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 0.3rem;
}

/* Search Box */
.search-box {
  margin-top: 0.3rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 25rem;
}

.search-input {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.search-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-input button {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
}

/* Card Container */
.card-container {
  overflow-y: auto;
  width: 100%;
  flex-grow: 1;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16%, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.4rem;
  justify-items: center;
  max-height: calc(6 * (auto)); /* 6 rows */
  overflow-y: auto;
}

.no-cards {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}

@media (max-width: 37.5em) { /* 600px ÷ 16px (default font size) = 37.5em */
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
    max-height: calc(6 * (auto));
  }
}

/* Card Details */
.card-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.card-detail {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  max-width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: inline-block;
}

.card-detail-image {
  max-width: 100%;
  max-height: 90vh;
  height: auto;
  background-color: black;
}

.card-detail-image.grayscale {
  filter: grayscale(100%) blur(5px);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 50%);
}

.card-info-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  z-index: 1001;
  text-align: center;
  font-size: 3vh;
  width: 52vh;
  height: 86vh;
  overflow: hidden;
}
</style>