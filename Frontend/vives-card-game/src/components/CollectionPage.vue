<template>
  <div class="card-collection">
    <h2 v-if="isCollectionRoute">Your Cards:</h2>
    <div class="card-grid" v-if="cards.length > 0">
      <PlayingCard
        v-for="card in cards"
        :key="card.id + card.image"
        :cardName="card.name"
        :cardImage="card.image"
        :attack="card.attack"
        :defense="card.defense"
        :health="card.health"
        :isSelected="selectedCards.includes(card.id)"
        @click="toggleCardSelection(card.id)"
      />
    </div>
    <div v-else>No cards found.</div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

export default {
  name: 'collection-page',
  components: {
    PlayingCard,
  },
  setup() {
    const route = useRoute();
    const cards = ref(require('../assets/cards.json')); // Direct import
    const selectedCards = ref([]);

    const isCollectionRoute = computed(() => {
      return route.path === '/collection';
    });

    const toggleCardSelection = (cardId) => {
      const index = selectedCards.value.indexOf(cardId);
      if (index > -1) {
        selectedCards.value.splice(index, 1);
      } else {
        selectedCards.value.push(cardId);
      }
    };

    const removeCard = (cardId) => {
      cards.value = cards.value.filter((card) => card.id !== cardId);
    };

    return { isCollectionRoute, cards, selectedCards, toggleCardSelection, removeCard };
  },
};
</script>

<style scoped>
.card-collection {
  padding: 20px;
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust as needed */
  gap: 20px;
  justify-items: center;
}
</style>