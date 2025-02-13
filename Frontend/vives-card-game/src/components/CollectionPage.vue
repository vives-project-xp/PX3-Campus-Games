<template>
  <div class="card-collection">
    <h2 v-if="isCollectionRoute">Your cards:</h2>
    <div class="card-grid" v-if="cards.length > 0">
      <div v-for="card in cards" :key="card.id">
        <img :src="getImageUrl(card.image)" :alt="card.name">
      </div>
    </div>
    <div v-else>No cards found.</div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue'; 

export default {
  name: 'collection-page',
  setup() {
    const route = useRoute();
    const cards = ref(require('../assets/testCards.json')); 
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

.card-collection {
  padding: 0px;
  font-size: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 30px;
}

p1 {
  font-size: 20px;
  font-weight: bold;
}
</style>