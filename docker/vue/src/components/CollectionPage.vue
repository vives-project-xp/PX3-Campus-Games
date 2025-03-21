<template>
  <div class="card-collection">
    <div class="fixed-container">
      <div class="search-box">
        <div class="total-cards">
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
import { computed, ref, onMounted } from 'vue';

export default {
  name: 'CollectionPage',
  components: { PlayingCard },
  setup() {
    const cards = ref([]);

   const filteredCards = computed(() => {
  if (!cards.value) return [];
  return cards.value.map(card => ({
    ...card,
    artwork_path: require(`@/assets/Cards/${card.artwork_path.split('/').pop()}`),
  }));
});
    const searchQuery = ref('');
    const selectedCards = ref([]);

    const fetchUserCards = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/userCards/${userId}`);
        const data = await response.json();
        console.log('Fetched cards:', data); // Log alle kaarten
        cards.value = data;
      } catch (error) {
        console.error('Error fetching user cards:', error);
      }
    };

    const toggleCardSelection = cardId => {
      if (selectedCards.value.includes(cardId)) {
        selectedCards.value = selectedCards.value.filter(id => id !== cardId);
      } else {
        selectedCards.value.push(cardId);
      }
    };

    onMounted(fetchUserCards);

    return {
      filteredCards,
      searchQuery,
      selectedCards,
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
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
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