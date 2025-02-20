<template>
    <div class="card-collection">
        <h2 v-if="isCollectionRoute">Your Cards:</h2>

        <!-- New Box for Additional Content -->
        <div class="additional-box">
            <!-- You can add any content here, like filters or buttons -->
            <p>Filter your cards:</p>
            <!-- Example filter input -->
            <input type="text" placeholder="Search cards..." />
        </div>

        <div class="card-grid" v-if="cards.length > 0">
            <PlayingCard v-for="card in cards"
                         :key="card.id + card.image"
                         :cardName="card.name"
                         :cardImage="card.image"
                         :isSelected="selectedCards.includes(card.id)"
                         @click="toggleCardSelection(card.id)" />
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

    return { isCollectionRoute, cards, selectedCards, toggleCardSelection };
  },
};
</script>

<style scoped>
.card-collection {
  padding: 1rem;
  width: 100%;
}

.card-grid {
  display: grid;  /* <-- MUST be present */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* <-- Responsive columns */
  gap: 1rem;       /* <-- Spacing between cards */
  justify-items: center; /* <-- Center cards horizontally */
}
.additional-box {
    background-color: #d4d4d4; /* Light background color */
    padding: 1rem; /* Padding around the box */
    margin-bottom: 1rem; /* Space between the box and the card grid */
    border-radius: 5px; /* Rounded corners */
}

</style>