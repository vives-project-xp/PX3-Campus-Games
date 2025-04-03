<template>
  <div class="daily-reward">
    <button 
      v-if="!showCards"
      @click="claimReward"
      :disabled="isLoading"
      class="reward-button"
    >
      <span v-if="isLoading">Laden...</span>
      <span v-else>Claim Dagelijkse Beloning</span>
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
        emit('reward-collected');

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
.daily-reward {
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  text-align: center;
  max-width: 1200px;
  width: 95%;
}

.reward-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.card-selection {
  margin-top: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.card-item {
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.card-item:hover {
  transform: scale(1.05);
}

.card-item.selected {
  box-shadow: 0 0 0 3px #2196F3;
  border-radius: 8px;
}

/* Aanpassingen voor PlayingCard zonder de component te wijzigen */
.card-item :deep(.card) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-item :deep(.card-image) {
  width: 100%;
  height: auto;
  max-height: 180px;
  object-fit: contain;
}

.card-item :deep(.card-name) {
  font-size: 0.9em;
  padding: 8px;
}

.actions {
  margin-top: 20px;
}

.confirm-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

/* Responsive aanpassingen */
@media (max-width: 1000px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 700px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>