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
    attack: { type: Number, required: true }, // curently not used, but can be used to display attack value
    defense: { type: Number, required: true }, //curently not used, but can be used to display defense value
    health: { type: Number, required: true }, //curently not used, but can be used to display health value
    isSelected: { type: Boolean, default: false }
  }
};

</script>

<style scoped>
.card {
  border: 1px solid var(--border-color);  /* Change border color */
  border-radius: var(--border-radius);   /* Change to adjust corner roundness */
  padding: 10px;       /* Change to adjust space *inside* the card, around all content */
  width: 100%;        /* Card takes full width of its grid cell */
  max-width: 250px;    /* Maximum card width.  Change this to make cards wider/narrower overall */
  box-shadow: var(--box-shadow);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  background-color: var(--primary-color);
  box-sizing: border-box;
  display: flex;          /* Use flexbox for vertical layout */
  flex-direction: column; /* Stack content vertically */
    height: auto;    /*  Change this to set minimum height */
}

.card:hover {
  transform: translateY(-5px); /*  Slightly move up on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /*  Stronger shadow on hover */
}

.card.selected {
  border-color: var(--secondary-color); /*  Change border color when selected */
  box-shadow: 0 4px 8px rgba(230, 0, 0, 0.3); /*  Change shadow when selected */
}

.card-image {
  width: 100%;          /* Image takes full width of card */
  height: auto;         /* Image height adjusts automatically to maintain aspect ratio */
  max-height: 350px;    /*  <--  Change to adjust *maximum* image height */
  object-fit: cover;   /* Image fills area, cropping if needed */
  display: block;
  margin: 0 auto;      /* Center image horizontally */
  border-radius: var(--border-radius) var(--border-radius) 0 0; /* Rounded corners on top */
  margin-bottom: 5px;  /*  <--  Change to adjust space between image and name */
}

.card-name {
  font-size: 1.2em;
  margin-top: 5px;    /*  <--  Change to adjust space *above* the name */
  margin-bottom: 0;   /*  <--  No space below the name */
  font-weight: bold;
  color: var(--secondary-color);
  text-align: center;
}
.card-info{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
}
</style>