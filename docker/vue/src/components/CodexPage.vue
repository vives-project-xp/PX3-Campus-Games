<template>
  <div class="codex">
    <h2 v-if="isCollectionRoute" class="heading">Codex:</h2>

    <!-- Fixed Top Section -->
    <div class="fixed-container">
      <!-- Filter Buttons -->
      <div class="filter-sort-container">
        <div class="sort-box">
          <button @click="sortCards('cardName')">Naam</button>
          <button @click="sortCards('rarity')">Zeldzaamheid</button>
          <button @click="sortCards('type')">Type</button>
        </div>
        <div class="search-input">
          <input type="text" v-model="searchQuery" placeholder="Kaarten zoeken..." />
          <button @click="clearSearch">x</button>
        </div>
      </div>
    </div>

    <!-- Scrollable Card Grid -->
    <div class="card-container">
      <div class="card-grid" v-if="filteredCards.length > 0">
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
          @mousemove="handleMouseMove"
        />

        <div
          v-if="showTopInfo"
          class="card-info-box top-info"
        >
          <p><strong>Name:</strong> {{ selectedCard.cardName }}</p>
          <p><strong>Type:</strong> {{ selectedCard.type }}</p>
          <p><strong>Rarity:</strong> {{ selectedCard.rarity }}</p>
          <p><strong>Description:</strong> {{ selectedCard.description }}</p>
        </div>

        <div
          v-if="showAttack"
          class="card-info-box attack-info"
        >
          <p><strong>Attack:</strong> {{ selectedCard.attack }}</p>
        </div>

        <div
          v-if="showAbility"
          class="card-info-box ability-info"
        >
          <p><strong>Ability:</strong> {{ selectedCard.ability }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { ref, computed, onMounted } from 'vue';
import { API_URL } from '../config';

export default {
  name: 'CodexPage',
  components: { PlayingCard },
  setup() {
    const allCards = ref([]);
    const userCards = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
    const searchQuery = ref('');
    const sortKey = ref(null);
    const sortDirection = ref(1); // 1 = ASC, -1 = DESC
    const selectedCard = ref(null);
    const showTopInfo = ref(false);
    const showAttack = ref(false);
    const showAbility = ref(false);

    const filteredCards = computed(() => {
      let filtered = allCards.value;

      if (searchQuery.value) {
        filtered = filtered.filter((card) =>
          card.cardName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortKey.value) {
        filtered.sort((a, b) => {
          let comparison = 0;
          if (a[sortKey.value] > b[sortKey.value]) comparison = 1;
          if (a[sortKey.value] < b[sortKey.value]) comparison = -1;
          return comparison * sortDirection.value;
        });
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
        const response = await fetch(`${API_URL}/api/cards`);
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
      selectedCard.value = card;
    };

    const closeCardDetails = () => {
      selectedCard.value = null;
      showTopInfo.value = false;
      showAttack.value = false;
      showAbility.value = false;
    };

    const handleMouseMove = (event) => {
      if (!selectedCard.value) return;

      const cardRect = event.target.getBoundingClientRect();
      const mouseX = event.clientX - cardRect.left;
      const mouseY = event.clientY - cardRect.top;

      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      showTopInfo.value = mouseY < cardHeight / 2;
      showAttack.value = mouseY >= cardHeight / 2 && mouseX < cardWidth / 2;
      showAbility.value = mouseY >= cardHeight / 2 && mouseX >= cardWidth / 2;
    };

    onMounted(async () => {
      await fetchAllCards();
      await fetchUserCards();
    });

    return {
      filteredCards,
      searchQuery,
      clearSearch,
      sortCards,
      userCards,
      showCardDetails,
      selectedCard,
      closeCardDetails,
      showTopInfo,
      showAttack,
      showAbility,
      handleMouseMove,
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
.filter-sort-container{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sort-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.sort-row button {
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

.sort-row button.active {
  background-color: red;
  color: white;
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
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.4rem;
  justify-items: center;
  padding-bottom: 2rem;
}

.no-cards {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}

@media (min-width: 600px) {
  .card-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
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
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

.card-detail-image {
  max-width: 100%;
  height: auto;
}

.card-detail-name {
  text-align: center;
  margin-top: 10px;
}

.card-info-box {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: var(--border-radius);
  z-index: 1001;
}

.top-info {
  top: 10px;
  left: 10px;
}

.attack-info {
  bottom: 10px;
  left: 10px;
}

.ability-info {
  bottom: 10px;
  right: 10px;
}
</style>