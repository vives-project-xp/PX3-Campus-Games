<template>
  <div class="leaderboard-container">
    <h1 class="heading">Scoreborden</h1>
    <div class="search-bar-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Zoek op gebruikersnaam..."
        class="search-input"
      />
      <button class="clearButton" @click="clearSearch">✖</button>
    </div>

    <div class="leaderboards-wrapper">
      <div class="leaderboard-section">
        <h2>Individueel scorebord</h2>
        <div class="leaderboard-content scrollable-leaderboard">
          <div v-if="userLoading" class="loading">Aan het laden...</div>
          <div v-else-if="userError" class="error">{{ userError }}</div>
          <table v-else-if="filteredUserLeaderboard.length > 0" class="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Gebruikersnaam</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in filteredUserLeaderboard" :key="user.id" :class="{ 'first': originalIndexOf(user.id) === 0, 'second': originalIndexOf(user.id) === 1, 'third': originalIndexOf(user.id) === 2 }">
                <td>
                  <span v-if="originalIndexOf(user.id) === 0" class="rank-emoji">🥇</span>
                  <span v-else-if="originalIndexOf(user.id) === 1" class="rank-emoji">🥈</span>
                  <span v-else-if="originalIndexOf(user.id) === 2" class="rank-emoji">🥉</span>
                  <span v-else>{{ originalIndexOf(user.id) + 1 }}</span>
                </td>
                <td>{{ usernameMap.get(user.id) || 'Laden...' }}</td>
                <td>{{ user.user_score }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="userLeaderboard.length > 0 && filteredUserLeaderboard.length === 0" class="no-data">
            Geen gebruikers gevonden met de naam "{{ searchQuery }}".
          </div>
          <div v-else class="no-data">Geen scorebord data beschikbaar.</div>
        </div>
      </div>

      <div class="leaderboard-section">
        <h2>Scorebord per studiegebied</h2>
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
                <td>
                  <span v-if="education.opleiding === topEducation" class="leader">🏆 {{ education.opleiding.replace('&', ' & ') }}</span>
                  <span v-else>{{ education.opleiding.replace('&', ' & ') }}</span>
                </td>
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
    const userLeaderboard = ref([]);
    const userLoading = ref(true);
    const userError = ref(null);
    const usernameMap = ref(new Map());

    const educationLeaderboard = ref([]);
    const educationLoading = ref(true);
    const educationError = ref(null);
    const topEducation = ref(null);

    const searchQuery = ref('');

    const fetchUserLeaderboard = async () => {
      userLoading.value = true;
      userError.value = null;
      usernameMap.value.clear();
      try {
        const response = await axios.get(`${API_URL}/api/getUsersScores`);
        userLeaderboard.value = response.data.sort((a, b) => b.user_score - a.user_score);

        const userIds = userLeaderboard.value.map(user => user.id);
        if (userIds.length > 0) {
          await Promise.all(userLeaderboard.value.map(async (user) => {
            try {
              const userResponse = await axios.get(`${API_URL}/api/getUserScoreById/${user.id}`);
              usernameMap.value.set(user.id, userResponse.data.username);
            } catch (userFetchError) {
              console.error(`Error fetching username for user ${user.id}:`, userFetchError);
              usernameMap.value.set(user.id, 'Gebruiker niet gevonden');
            }
          }));
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
            educationLeaderboard.value = response.data.sort((a, b) => b.total_score - a.total_score);

            if (educationLeaderboard.value.length > 0) {
                topEducation.value = educationLeaderboard.value[0].opleiding;
            } else {
                topEducation.value = null;
            }

        } catch (err) {
            console.error('Error fetching education leaderboard:', err);
            educationError.value = 'Kan opleiding scorebord niet ophalen.';
        } finally {
            educationLoading.value = false;
        }
    };

    const filteredUserLeaderboard = computed(() => {
      if (!searchQuery.value) {
        return userLeaderboard.value;
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase();
      return userLeaderboard.value.filter(user => {
        const username = usernameMap.value.get(user.id)?.toLowerCase();
        return username && username.includes(lowerCaseQuery);
      });
    });

    const originalIndexOf = (userId) => {
        return userLeaderboard.value.findIndex(user => user.id === userId);
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

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
      topEducation,
      searchQuery,
      clearSearch,
      filteredUserLeaderboard,
      originalIndexOf,
    };
  },
};
</script>

<style scoped>
body, html {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fff;
    color: #333;
    font-family: sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
}

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
  gap: 20px;
  align-items: flex-start;
}

.leaderboard-section {
  width: 48%;
  margin: 0;
  min-width: 300px;
  background-color: #fff; 
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px; 
  box-sizing: border-box; 
  display: flex; 
  flex-direction: column;
  align-items: center;
}

.leaderboard-section h2 {
    margin-top: 0;
    color: #333; 
    margin-bottom: 15px;
    text-align: center;
}

.search-bar-container {
  width: 100%;
  margin-bottom: 20px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  padding: 10px 15px; 
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 90%;
  max-width: 400px;
  font-size: 1rem;
  height: 40px; 
  box-sizing: border-box;
}

.leaderboard-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
   max-height: 550px; 
   overflow-y: auto;
}


.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #fff;
}

.leaderboard-table thead {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
    box-shadow: 0 2px 0 0 #333;
    margin: 0;
    padding: 0;
    will-change: transform, position;
}

.leaderboard-table thead tr {
    margin: 0;
    padding: 0;
}


.leaderboard-table th {
  padding: 12px;
  border: none;
  text-align: center;
  background-color: transparent;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9em;
  position: static;
  top: auto;
  z-index: auto;
}

.leaderboard-table td {
  padding: 12px;
  border: none;
  text-align: center;
  border-bottom: 1px solid #eee;
  color: #555;
}

.leaderboard-table tbody tr:last-child td {
    border-bottom: none;
}

.loading,
.error,
.no-data {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  color: #555;
}

.rank-emoji {
  font-size: 1.2em;
}

.first td {
  color: gold;
  font-weight: bold;
}

.second td {
  color: silver;
  font-weight: bold;
}

.third td {
  color: #cd7f32;
  font-weight: bold;
}

.leader {
    color: red;
    font-weight: bold;
}


.clearButton {
  background: red;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 40px;
  width: 40px;
  padding: 0;
  box-sizing: border-box;
}

@media (max-width: 800px) {
  .leaderboards-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    align-items: center;
  }

  .leaderboard-section {
    width: 95%;
    margin: 0;
    padding: 10px;
  }

  .search-input {
    width: 90%;
  }

  .leaderboard-table th,
  .leaderboard-table td {
      padding: 8px;
  }

  .leaderboard-section h2 {
      font-size: 1.2em;
      margin-bottom: 10px;
  }

   .leaderboard-content {
       max-height: 400px;
   }
}

@media (max-width: 400px) {
    .search-bar-container {
        flex-direction: column;
        gap: 10px;
    }

    .search-input {
        width: 100%;
        max-width: none;
    }

    .clearButton {
        width: 100%;
        margin-left: 0;
    }
}
</style>