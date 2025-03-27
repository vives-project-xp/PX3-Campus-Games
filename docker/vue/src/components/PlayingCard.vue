<template>
  <div class="card" :class="{ selected: isSelected, grayscale: grayscale }" @click="$emit('click')">
    <img :src="cardImage" :alt="cardName" class="card-image" />
    <p class="card-name">{{ cardName }}</p>
  </div>
</template>

<script>
export default {
  name: 'PlayingCard',
  props: {
    cardName: { type: String, required: true },
    cardImage: { type: String, required: true },
    attack: { type: Number, required: false },
    ability: { type: Number, required: false },
    health: { type: Number, required: false },
    isSelected: { type: Boolean, default: false },
    grayscale: { type: Boolean, default: false },
  },
  mounted() {
    console.log('PlayingCard props:', {
      cardName: this.cardName,
      cardImage: this.cardImage,
      attack: this.attack,
      ability: this.ability,
      health: this.health,
      isSelected: this.isSelected,
      grayscale: this.grayscale,
    });
  },
};
</script>

<style scoped>
.card {
  border: 0.1rem solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease, box-shadow 0.5s ease;
  background-color: var(--primary-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: auto;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card.selected {
  border-color: var(--secondary-color);
  box-shadow: 0 4px 8px rgba(230, 0, 0, 0.3);
}

.card-image {
  width: 70%;
  height: auto;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.card-name {
  font-size: 1em;
  margin-top: 0.3rem;
  margin-bottom: 0;
  font-weight: bold;
  color: var(--secondary-color);
  text-align: center;
}

.card.grayscale {
  filter: grayscale(100%);
}
</style>