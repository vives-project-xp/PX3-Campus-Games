<template>
  <div class="card" :class="{ 'selected': isSelected, 'damaged': health < 20 }">
    <img :src="cardImage" :alt="cardName" class="card-image">
    <div class="card-info">
      <h2 class="card-name">{{ cardName }}</h2>
      <p>Attack: {{ attack }}</p>
      <p>Defense: {{ defense }}</p>
      <p>Health: <span :style="{ color: healthColor }">{{ health }}</span></p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'playing-card',
  props: {
    cardImage: { type: String, required: true },
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  width: 20px;
  height: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card.selected {
  border-color: blue;
  box-shadow: 0 4px 8px rgba(0, 0, 255, 0.3);
}

.card.damaged {
    background-color: #ffdddd;
}

.card-image {
  max-width: 100%;
  max-height:150px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.card-name {
  font-size: 1.1em;
  margin-bottom: 6px;
  font-weight: bold;
}

.card-info p {
  margin: 4px 0;
}
</style>