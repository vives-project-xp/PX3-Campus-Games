<template>
  <div class="card" :class="{ 'selected': isSelected, 'damaged': health < 20 }">
    <img :src="cardImage" :alt="cardName" class="card-image">
    <div class="card-info">
      <p class="card-name">{{ cardName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'playing-card',
  props: {
    cardName: { type: String, required: true },
    cardImage: { type: String, required: true },
    attack: { type: Number, required: false }, // Optioneel, kan worden gebruikt om aanval te tonen
    defense: { type: Number, required: false }, // Optioneel, kan worden gebruikt om verdediging te tonen
    health: { type: Number, required: false }, // Optioneel, kan worden gebruikt om gezondheid te tonen
    isSelected: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.card {
  border: 0.1rem solid var(--border-color); /* Verander randkleur */
  border-radius: var(--border-radius); /* Pas hoekafronding aan */
  width: 100%; /* Kaart neemt volledige breedte van de gridcel */
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease, box-shadow 0.5s ease;
  background-color: var(--primary-color);
  box-sizing: border-box;
  display: flex; /* Gebruik flexbox voor verticale layout */
  flex-direction: column; /* Stapel inhoud verticaal */
  height: auto; /* Pas hoogte automatisch aan */
}

.card:hover {
  transform: translateY(-5px); /* Beweeg iets omhoog bij hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sterkere schaduw bij hover */
}

.card.selected {
  border-color: var(--secondary-color); /* Verander randkleur bij selectie */
  box-shadow: 0 4px 8px rgba(230, 0, 0, 0.3); /* Verander schaduw bij selectie */
}

.card-image {
  width: 100%; /* Afbeelding neemt volledige breedte van de kaart */
  height: auto; /* Hoogte wordt automatisch aangepast om de aspectratio te behouden */
  object-fit: cover; /* Afbeelding vult de ruimte, bijsnijden indien nodig */
  display: block;
  margin: 0 auto; /* Centreer afbeelding horizontaal */
  border-radius: var(--border-radius) var(--border-radius) 0 0; /* Afgeronde hoeken aan de bovenkant */
}

.card-name {
  font-size: 1em;
  margin-top: 0.3rem; /* Pas ruimte boven de naam aan */
  margin-bottom: 0; /* Geen ruimte onder de naam */
  font-weight: bold;
  color: var(--secondary-color);
  text-align: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
</style>