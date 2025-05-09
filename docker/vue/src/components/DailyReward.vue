<template>
  <div class="daily-reward">
    <button
      v-if="!showCards"
      @click="claimReward"
      :disabled="isLoading"
      class="reward-button"
    >
      <img
        v-if="!isLoading"
        src="@/assets/cardpack.png"
        alt="Claim Dagelijkse Beloning"
        class="card-pack-image"
      />
      <span v-else>Laden...</span>
    </button>

    <div v-if="showCards" class="card-selection">
      <h3>Kies je dagelijkse beloning:</h3>
      <div class="cards-container">
        <div
          v-for="card in rewardCards"
          :key="card.card_id"
          @click="selectCard(card)"
          class="card-item"
          :class="{ selected: selectedCard?.card_id === card.card_id }"
        >
          <PlayingCard
            :cardName="card.cardName"
            :cardImage="card.artwork_path"
            :attack="card.attack"
            :ability="card.ability"
            :health="card.health"
          />
        </div>
      </div>

      <div v-if="selectedCard" class="actions">
        <button
          @click="confirmSelection"
          :disabled="isSelecting"
          class="confirm-button"
        >
          <span v-if="isSelecting">Bezig...</span>
          <span v-else>Bevestig selectie</span>
        </button>
      </div>
    </div>

    <div v-if="message" class="feedback" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue';
import { onMounted, ref } from 'vue';
import { API_URL } from '../config';
import { useRouter } from 'vue-router';

export default {
  components: { PlayingCard },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const rewardCards = ref([]);
    const selectedCard = ref(null);
    const showCards = ref(false);
    const isLoading = ref(false);
    const isSelecting = ref(false);
    const message = ref('');
    const isError = ref(false);
    const route = useRouter();

    const claimReward = async () => {
      isLoading.value = true;
      message.value = '';
      isError.value = false;

      try {
        const userIdToSend = props.userId || Number(localStorage.getItem('userId'));
        if (!userIdToSend) throw new Error('Gebruiker niet ingelogd');

        const response = await fetch(`${API_URL}/api/daily`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId: userIdToSend })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Server error');
        }

        if (!data.cards || data.cards.length === 0) {
          throw new Error('Geen kaarten ontvangen van server');
        }

        rewardCards.value = data.cards.map(card => {
          const imagePath = card.artwork_path || 'default_card.png';
          return {
            ...card,
            artwork_path: require(`@/assets/Cards/${imagePath}`)
          };
        });

        showCards.value = true;

      } catch (error) {
        isError.value = true;
        message.value = error.message;
        console.error('Claim error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const selectCard = (card) => {
      selectedCard.value = card;
    };

    const confirmSelection = async () => {
      if (!selectedCard.value) return;

      isSelecting.value = true;
      message.value = '';
      isError.value = false;

      try {
        const userIdToSend = props.userId || Number(localStorage.getItem('userId'));
        const response = await fetch(`${API_URL}/api/daily/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: userIdToSend,
            cardId: selectedCard.value.card_id
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Fout bij bevestigen');
        }

        message.value = data.message || 'Beloning ontvangen!';
        showCards.value = false;
        selectedCard.value = null;

        // Update de reward status direct
        emit('reward-collected', false);

      } catch (error) {
        isError.value = true;
        message.value = error.message;
        console.error('Selection error:', error);
      } finally {
        isSelecting.value = false;
      }
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        route.push('/login');
      }
    };

    onMounted(() => {
      checkLoginStatus();
    });

    return {
      rewardCards,
      selectedCard,
      showCards,
      isLoading,
      isSelecting,
      message,
      isError,
      claimReward,
      selectCard,
      confirmSelection
    };
  }
};
</script>

<style scoped>
/* Basis container styling */
.daily-reward {
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  max-width: 1200px;
  width: 95%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Titel styling */
.card-selection h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/* Claim knop styling */
.reward-button {
  background: none; /* Verwijder de standaard achtergrond */
  border: none; /* Verwijder de rand */
  padding: 0; /* Verwijder de padding */
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-bottom: 1.5rem;
  display: inline-block; /* Zorg ervoor dat de afbeelding inline is */
}

.reward-button:hover {
  opacity: 0.8;
}

.reward-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-pack-image {
  width: 150px; /* Pas de grootte naar wens aan */
  height: auto;
  display: block; /* Voorkom extra ruimte onder de afbeelding */
}

.reward-button span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

/* Cards container */
.cards-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Uitgelijnd aan de bovenkant */
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

/* Kaart styling */
.card-item {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 280px;
}

/* Card naam in ROOD */
.card-item :deep(.card-name) {
  font-size: 1.2rem;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  color: #ff0000; /* Rode tekst */
  width: 100%;
  background-color: white; /* Witte achtergrond voor betere leesbaarheid */
  margin-top: -5px; /* Compenseer voor de afgeronde hoeken */
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Afbeeldingen die niet worden afgesneden */
.card-item :deep(.card-image) {
  width: 100%;
  height: 300px;
  object-fit: contain; /* Behoudt aspect ratio zonder afsnijden */
  object-position: center;
  background-color: #f5f5f5; /* Achtergrond voor transparante afbeeldingen */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border: 1px solid #eee; /* Subtiele rand */
}

/* Hover effect */
.card-item:hover {
  transform: translateY(-5px);
}

.card-item:hover :deep(.card-name) {
  color: #cc0000; /* Donkerder rood bij hover */
}

/* Geselecteerde kaart */
.card-item.selected {
  box-shadow: 0 0 0 3px #2196F3;
}

/* Confirm button styling */
.confirm-button {
  background-color: #007bff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.confirm-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.confirm-button:disabled {
  background-color: #b3d7ff;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Feedback message styling */
.feedback {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
}

.feedback.error {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.feedback:not(.error) {
  background-color: #e6f7e6;
  color: #388e3c;
  border: 1px solid #388e3c;
}

/* Responsive aanpassingen */
@media (max-width: 768px) {
  .cards-container {
    gap: 1.5rem;
  }

  .card-item {
    width: 240px;
  }

  .card-item :deep(.card-image) {
    height: 250px;
  }

  .card-pack-image {
    width: 120px;
  }
}

@media (max-width: 480px) {
  .card-item {
    width: 100%;
    max-width: 280px;
  }

  .card-pack-image {
    width: 100px;
  }
}
</style>