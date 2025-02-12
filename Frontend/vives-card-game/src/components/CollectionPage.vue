<template>
  <div class="card-collection">
    <h2 v-if="isCollectionRoute">Your Cards:</h2>
    <div class="card-grid" v-if="cards.length > 0">
      <div v-for="card in cards" :key="card.id">
        <h3>{{ card.name }}</h3>
        <img :src="getImageUrl(card.image)" :alt="card.name">
        <h4>Rarity: {{ card.rarity }}</h4>
        <p>Attack: {{ card.attack }}</p>
        <p>Defense: {{ card.defense }}</p>
        <p>Health: {{ card.health }}</p>
      </div>
    </div>
    <div v-else>No cards found.</div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue'; // Removed onMounted

export default {
  name: 'collection-page',
  setup() {
    const route = useRoute();
    const cards = ref(require('../assets/cards.json')); // Directly import JSON
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

    const getImageUrl = (relativePath) => {
      return require('../assets' + relativePath);
    }

    return { isCollectionRoute, cards, selectedCards, toggleCardSelection, removeCard, getImageUrl};
  },
};
</script>

<style scoped>
/* (Your styles) */
.card-collection {
  padding: 0px;
  font-size: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}
</style>