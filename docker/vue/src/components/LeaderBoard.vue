<template>
  <div class="leaderboard-container">
      <h1 class="heading">Scoreborden</h1>

      <div class="leaderboards-wrapper">
          <div class="leaderboard-section">
              <h2>Gebruikers Scorebord</h2>
              <div class="leaderboard-content">
                  <div v-if="userLoading" class="loading">Aan het laden...</div>
                  <div v-else-if="userError" class="error">{{ userError }}</div>
                  <table v-else-if="userLeaderboard.length > 0" class="leaderboard-table">
                      <thead>
                          <tr>
                              <th>Rank</th>
                              <th>Gebruikersnaam</th>
                              <th>Score</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(user, index) in userLeaderboard" :key="user.id" :class="{ 'leader': index === 0 }">
                              <td>{{ index + 1 }}</td>
                              <td>{{ usernameMap.get(user.id) }}</td>
                              <td>{{ user.user_score }}</td>
                          </tr>
                      </tbody>
                  </table>
                  <div v-else class="no-data">Geen scorebord data beschikbaar.</div>
              </div>
          </div>

          <div class="leaderboard-section">
              <h2>Opleiding Scorebord</h2>
              <div class="leaderboard-content">
                  <div v-if="educationLoading" class="loading">Aan het laden...</div>
                  <div v-else-if="educationError" class="error">{{ educationError }}</div>
                  <table v-else-if="educationLeaderboard.length > 0" class="leaderboard-table">
                      <thead>
                          <tr>
                              <th>Opleiding</th>
                              <th>Totale Score</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="education in educationLeaderboard" :key="education.opleiding" :class="{ 'leader': education.opleiding === topEducation }">
                              <td>{{ education.opleiding }}</td>
                              <td>{{ education.total_score }}</td>
                          </tr>
                      </tbody>
                  </table>
                  <div v-else class="no-data">Geen scorebord data beschikbaar.</div>
              </div>
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
        // User Leaderboard
        const userLeaderboard = ref([]);
        const userLoading = ref(true);
        const userError = ref(null);
        const usernameMap = ref(new Map());

        // Education Leaderboard
        const educationLeaderboard = ref([]);
        const educationLoading = ref(true);
        const educationError = ref(null);
        const topEducation = ref(null); // Variable to store the top opleiding

        const fetchUserLeaderboard = async () => {
            userLoading.value = true;
            userError.value = null;
            try {
                const response = await axios.get(`${API_URL}/api/getUsersScores`);
                userLeaderboard.value = response.data;

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
                userError.value = 'Kan scorebord niet ophalen.';
            } finally {
                userLoading.value = false;
            }
        };

        const fetchEducationLeaderboard = async () => {
            educationLoading.value = true;
            educationError.value = null;
            try {
                const response = await axios.get(`${API_URL}/api/getScoreByEducation`);
                educationLeaderboard.value = response.data;

                // Find the education type with the highest total score
                if (educationLeaderboard.value.length > 0) {
                    let maxScore = -Infinity;
                    let topOpleiding = null;
                    for (const education of educationLeaderboard.value) {
                        if (education.total_score > maxScore) {
                            maxScore = education.total_score;
                            topOpleiding = education.opleiding;
                        }
                    }
                    topEducation.value = topOpleiding;
                }

            } catch (err) {
                console.error('Error fetching education leaderboard:', err);
                educationError.value = 'Kan opleiding scorebord niet ophalen.';
            } finally {
                educationLoading.value = false;
            }
        };

        const getUsername = (userId) => {
            return usernameMap.value.get(userId) || 'Unknown User';
        };

        const isLeaderboardRoute = computed(() => {
            return route.path === '/leaderboard';
        });

        onMounted(() => {
            fetchUserLeaderboard();
            fetchEducationLeaderboard();
        });

        return {
            userLeaderboard,
            userLoading,
            userError,
            usernameMap,
            educationLeaderboard,
            educationLoading,
            educationError,
            isLeaderboardRoute,
            getUsername,
            topEducation, // Expose topEducation to the template
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
    width: 90%;
    max-width: 1200px;
    margin: auto;
}

.heading {
    margin-bottom: 20px;
    font-size: 2rem;
    text-align: center;
}

.leaderboards-wrapper {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.leaderboard-section {
    width: 48%;
    margin: 10px;
}

.leaderboard-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
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

.leader {
    color: red;
    font-weight: bold;
    border: 2px solid red;
}
</style>