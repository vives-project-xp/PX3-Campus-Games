<!-- component voor de kaartenverzameling van een speler -->

<template>
  <div class="card-collection">
    <h2 v-if="isCollectionRoute">My Card Collection</h2>
    <div class="card-grid">
      <PlayingCard
        v-for="card in cards"
        :key="card.id"
        :cardName="card.name"
        :cardRarity="card.rarity"
        :cardImage="card.image"
        :attack="card.attack"
        :defense="card.defense"
        :health="card.health"
        :isSelected="selectedCards.includes(card.id)"
        @click="toggleCardSelection(card.id)"
      >
        <button @click.stop="removeCard(card.id)">Remove</button>
      </PlayingCard>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'collection-page',
  components: {
    PlayingCard
  },
  data() {
    return {
      cards: [],
      selectedCards: []
    };
  },
  methods: {
    toggleCardSelection(cardId) {
      const index = this.selectedCards.indexOf(cardId);
      if (index > -1) {
        this.selectedCards.splice(index, 1);
      } else {
        this.selectedCards.push(cardId);
      }
    },
    async fetchCards() {
  try {
    console.log('fetchCards called'); // ADD THIS
    const response = await fetch('/api/cards'); // Correct!
    console.log('Response:', response); // ADD THIS
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Get the parsed JSON
    console.log('Fetched data:', data); // ADD THIS
    this.cards = data; // Assign the data
    console.log('this.cards:', this.cards); // ADD THIS
  } catch (error) {
    console.error("Could not fetch cards:", error);
  }
},
    removeCard(cardId) {
        this.cards = this.cards.filter(card => card.id !== cardId);
    }
  },
  mounted() {
    this.fetchCards();
  },
  setup() {
    const route = useRoute();

    const isCollectionRoute = computed(() => {
      return route.path === '/collection';
    });

    return { isCollectionRoute };
  }
};
</script>

<style scoped>
.card-collection {
  padding: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}
</style>