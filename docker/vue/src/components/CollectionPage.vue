<template>
  <div class="card-collection">
    <h2 v-if="isCollectionRoute" class="heading">Eigen kaarten:</h2>

    <!-- Fixed Top Section -->
    <div class="fixed-container">
      <!-- Filter Buttons -->
      <div class="filter-box">
        <div class="filter-row">
          <button :class="{ active: selectedRarities.includes('Common') }" @click="toggleFilter('Common')">Gewoon</button>
          <button :class="{ active: selectedRarities.includes('Uncommon') }" @click="toggleFilter('Uncommon')">Ongewoon</button>
          <button :class="{ active: selectedRarities.includes('Rare') }" @click="toggleFilter('Rare')">Zeldzaam</button>
        </div>
        <div class="filter-row">
          <button :class="{ active: selectedRarities.includes('Ultra Rare') }" @click="toggleFilter('Ultra Rare')">Zeer Zeldzaam</button>
          <button :class="{ active: selectedRarities.includes('Legendary') }" @click="toggleFilter('Legendary')">Legendarisch</button>
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
      <div class="card-grid" v-if="filteredCards.length > 0">
        <PlayingCard
          v-for="card in filteredCards"
          :key="card.card_id"
          :cardName="card.cardName"
          :cardImage="card.artwork_path"
          :attack="card.attack"
          :ability="card.ability"
          :health="card.health"
          :isSelected="selectedCards.includes(card.card_id)"
          @click="toggleCardSelection(card.card_id)"
        />
      </div>
      <div v-else class="no-cards">Geen kaarten gevonden.</div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { API_URL } from '../config';

export default {
  name: 'CollectionPage',
  components: { PlayingCard },
  setup() {
    const route = useRoute();
    const cards = ref([]);
    const selectedCards = ref([]);
    const selectedRarities = ref([]);
    const searchQuery = ref('');

    const isCollectionRoute = computed(() => route.path === '/collection');

    const toggleFilter = (rarity) => {
      if (selectedRarities.value.includes(rarity)) {
        selectedRarities.value = selectedRarities.value.filter((r) => r !== rarity);
      } else {
        selectedRarities.value.push(rarity);
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const filteredCards = computed(() => {
      let filtered = cards.value;
      if (selectedRarities.value.length > 0) {
        filtered = filtered.filter((card) => selectedRarities.value.includes(card.rarity));
      }
      if (searchQuery.value) {
        filtered = filtered.filter((card) =>
          card.cardName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return filtered.map((card) => ({
        ...card,
        artwork_path: require(`@/assets/Cards/${card.artwork_path.split('/').pop()}`),
      }));
    });

    const toggleCardSelection = (cardId) => {
      if (selectedCards.value.includes(cardId)) {
        selectedCards.value = selectedCards.value.filter((id) => id !== cardId);
      } else {
        selectedCards.value.push(cardId);
      }
    };

    const fetchUserCards = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${API_URL}/api/userCards/${userId}`);
        const data = await response.json();
        cards.value = data;
      } catch (error) {
        console.error('Error fetching user cards:', error);
      }
    };

    onMounted(fetchUserCards);

    return {
      isCollectionRoute,
      filteredCards,
      selectedCards,
      toggleFilter,
      selectedRarities,
      searchQuery,
      clearSearch,
      toggleCardSelection,
    };
  },
};
</script>

<style scoped>
.card-collection {
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

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>