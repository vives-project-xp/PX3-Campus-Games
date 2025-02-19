<template>
  <div class="card" :class="{ 'selected': isSelected, 'damaged': health < 20 }">
    <img :src="require(`@/assets/` + cardImage)" :alt="cardName" class="card-image">
    <div class="card-info">
      <h2 class="card-name">{{ cardName }}</h2>
      </div>
  </div>
</template>

<script>
export default {
  name: 'playing-card',
  props: {
    cardName: { type: String, required: true },
    cardImage: { type: String, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    health: { type: Number, required: true },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    healthColor() {
      if (this.health >= 50) {
        return 'green';
      } else if (this.health >= 20) {
        return 'orange';
      } else {
        return 'red';
      }
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 15px;
  width: 100%;
  max-width: 250px;
  box-shadow: var(--box-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: var(--primary-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card.selected {
  border-color: var(--secondary-color);
  box-shadow: 0 4px 8px rgba(230, 0, 0, 0.3);
}

.card.damaged {
    background-color: #ffdddd;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  margin-bottom: 10px;
}

.card-name {
  font-size: 1.2em;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--secondary-color);
  text-align: center;
}

.card-info p {
  margin: 5px 0;
  text-align: center;
}
.card-info{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
}
</style>