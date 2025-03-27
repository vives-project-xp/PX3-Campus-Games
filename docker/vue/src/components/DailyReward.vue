<template>
    <div class="daily-reward">
      <!-- Daily Reward Button -->
      <button 
        v-if="!showCards"
        @click="claimReward"
        :disabled="isLoading"
        class="reward-button"
      >
        <span v-if="isLoading">Laden...</span>
        <span v-else>Claim Dagelijkse Beloning</span>
      </button>
  
      <!-- Reward Cards Selection -->
      <div v-if="showCards" class="card-selection">
        <h3>Kies je dagelijkse beloning:</h3>
        <div class="cards-grid">
          <div 
            v-for="cardId in rewardCards"
            :key="cardId"
            @click="selectCard(cardId)"
            class="card-wrapper"
            :class="{ selected: selectedCard === cardId }"
          >
            <PlayingCard :cardId="cardId" />
          </div>
        </div>
        
        <div class="actions">
          <button 
            @click="confirmSelection"
            :disabled="!selectedCard || isSelecting"
            class="confirm-button"
          >
            <span v-if="isSelecting">Bezig...</span>
            <span v-else>Bevestig Keuze</span>
          </button>
        </div>
      </div>
  
      <!-- Feedback Messages -->
      <div v-if="message" class="feedback" :class="{ error: isError }">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import PlayingCard from './PlayingCard.vue';
  
  export default {
    components: { PlayingCard },
    props: {
      userId: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const rewardCards = ref([]);
      const selectedCard = ref(null);
      const showCards = ref(false);
      const isLoading = ref(false);
      const isSelecting = ref(false);
      const message = ref('');
      const isError = ref(false);
  
      const claimReward = async () => {
        isLoading.value = true;
        message.value = '';
        isError.value = false;
        
        try {
          const response = await fetch('/api/rewards/daily', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: props.userId })
          });
  
          const data = await response.json();
  
          if (data.success) {
            rewardCards.value = data.cards;
            showCards.value = true;
          } else {
            isError.value = true;
            message.value = data.message || 'Kon beloning niet ophalen';
          }
        } catch (error) {
          isError.value = true;
          message.value = 'Fout bij verbinden met server';
          console.error('Claim error:', error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const selectCard = (cardId) => {
        selectedCard.value = cardId;
      };
  
      const confirmSelection = async () => {
        if (!selectedCard.value) return;
        
        isSelecting.value = true;
        message.value = '';
        isError.value = false;
  
        try {
          const response = await fetch('/api/rewards/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: props.userId,
              cardId: selectedCard.value
            })
          });
  
          const data = await response.json();
  
          if (data.success) {
            message.value = 'Beloning ontvangen!';
            showCards.value = false;
            selectedCard.value = null;
            // Emit event to parent to refresh collection
            emit('reward-collected', data.cardId);
          } else {
            isError.value = true;
            message.value = data.error || 'Fout bij selecteren kaart';
          }
        } catch (error) {
          isError.value = true;
          message.value = 'Fout bij verbinden met server';
          console.error('Selection error:', error);
        } finally {
          isSelecting.value = false;
        }
      };
  
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
    margin: 20px 0;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    text-align: center;
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
  }
  
  .reward-button:hover {
    background-color: #45a049;
  }
  
  .reward-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .card-selection {
    margin-top: 20px;
  }
  
  .cards-grid {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  
  .card-wrapper {
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .card-wrapper:hover {
    transform: scale(1.05);
  }
  
  .card-wrapper.selected {
    box-shadow: 0 0 10px 5px rgba(76, 175, 80, 0.5);
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
  
  .confirm-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .feedback {
    margin-top: 15px;
    padding: 10px;
    border-radius: 5px;
    background-color: #dff0d8;
    color: #3c763d;
  }
  
  .feedback.error {
    background-color: #f2dede;
    color: #a94442;
  }
  </style>