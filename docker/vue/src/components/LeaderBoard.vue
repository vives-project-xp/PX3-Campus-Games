<template>
    <div class="leaderboard-container">
      <h1 class="heading">Scorebord</h1>
  
      <div class="leaderboard-content">
        <div v-if="loading" class="loading">
          Aan het laden...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        <div v-else-if="leaderboard.length > 0" class="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Gebruikersnaam</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in leaderboard" :key="user.id" :class="{ 'top-user': index === 0 }">
                <td>{{ index + 1 }}</td>
                <td>{{ usernameMap.get(user.id) }}</td>
                <td>{{ user.user_score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="no-data">
          Geen scorebord data beschikbaar.
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { API_URL } from '../config';
  import axios from 'axios';
  
  export default {
    name: 'Leaderboard',
    setup() {
      const leaderboard = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const usernameMap = ref(new Map());
  
      const fetchLeaderboard = async () => {
        loading.value = true;
        error.value = null;
        try {
          const response = await axios.get(`${API_URL}/api/getUsersScores`);
          leaderboard.value = response.data;
          
          for (const user of response.data) {
            try {
              const userResponse = await axios.get(`${API_URL}/api/getUserScoreById/${user.id}`);
              usernameMap.value.set(user.id, userResponse.data.username);
            } catch (userError) {
              console.error(`Error fetching username for user ${user.id}:`, userError);
              usernameMap.value.set(user.id, 'Unknown User');
            }
          }
  
        } catch (err) {
          console.error('Error fetching leaderboard:', err);
          error.value = 'Kan scorebord niet ophalen.';
        } finally {
          loading.value = false;
        }
      };
  
      const getUsername = (userId) => {
        return usernameMap.value.get(userId) || 'Unknown User';
      };
  
      onMounted(fetchLeaderboard);
  
      return {
        leaderboard,
        loading,
        error,
        usernameMap,
        isLeaderboardRoute: computed(() => route.path === '/leaderboard'),
        getUsername,
      };
    },
  };
  </script>
  
  <style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 85%; /* 85% width */
  max-width: 800px; /* Optional: Keep a maximum width */
  margin: auto; /* Center horizontally */
}

.heading {
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center; /* Center the heading */
}

.leaderboard-content {
  width: 100%;
  display: flex; /* Use flexbox for centering */
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Center horizontally */
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.leaderboard-table th {
  background-color: #f2f2f2;
}

.loading,
.error,
.no-data {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #555;
}

/* Style for the top user */
.top-user {
  border: 2px solid red;
  /* Add any other styling you want for the top user row */
}
</style>