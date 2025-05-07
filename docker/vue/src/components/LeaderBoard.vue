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
        <div class="leaderboard-content">
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
  gap: 20px; /* Add some gap between the two sections */
}

.leaderboard-section {
  width: 48%; /* Adjust width slightly to accommodate gap */
  margin: 0; /* Remove margin as gap on wrapper is used */
  min-width: 300px;
  background-color: #fff; /* White background for the section container */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
  padding: 15px; /* Add padding inside the section */
  box-sizing: border-box; /* Include padding in width */
  display: flex; /* Use flex to arrange heading and content */
  flex-direction: column;
  align-items: center;
}

.leaderboard-section h2 {
    margin-top: 0;
    color: #333; /* Darker color for section titles */
    margin-bottom: 15px;
    text-align: center;
}

.search-bar-container {
  width: 100%;
  margin-bottom: 20px; /* Increase margin below search bar */
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  padding: 10px 15px; /* Increase padding */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 90%;
  max-width: 400px;
  font-size: 1rem;
  height: 40px; /* Adjust height */
  box-sizing: border-box;
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
  margin-top: 10px;
  background-color: #fff; /* White background for the table itself */
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 12px; /* Increase padding for better spacing */
  border: none; /* Remove all borders */
  text-align: center;
}

.leaderboard-table th {
  background-color: transparent; /* No background */
  color: #333; /* Dark text */
  font-weight: bold;
  border-bottom: 2px solid #333; /* Stronger bottom border */
  text-transform: uppercase; /* Uppercase header text */
  font-size: 0.9em; /* Slightly smaller font for header */
}

.leaderboard-table td {
  border-bottom: 1px solid #eee; /* Light grey bottom border for rows */
  color: #555; /* Default text color for data */
}

.leaderboard-table tbody tr:last-child td {
    border-bottom: none; /* Remove bottom border from the last row */
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

/* Keep existing styles for top ranks/leaders, adjust colors if needed for contrast */
.first td {
  color: gold; /* Gold color for 1st place */
  font-weight: bold;
}

.second td {
  color: silver; /* Silver color for 2nd place */
  font-weight: bold;
}

.third td {
  color: #cd7f32; /* Bronze color for 3rd place */
  font-weight: bold;
}

.leader { /* Style for the leading education type */
    color: red; /* Use red to make the leader stand out */
    font-weight: bold;
}


.clearButton {
  background: red; /* Keep clear button red */
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
  height: 40px; /* Match search input height */
  width: 40px; /* Make it square */
  padding: 0; /* Remove padding, use flexbox for centering */
  box-sizing: border-box;
}

@media (max-width: 800px) {
  .leaderboards-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 15px; /* Adjust gap for stacked layout */
  }

  .leaderboard-section {
    width: 95%;
    margin: 0; /* Remove margin when stacked */
    padding: 10px; /* Adjust padding */
  }

  .search-input {
    width: 90%;
  }

  .leaderboard-table th,
  .leaderboard-table td {
      padding: 8px; /* Reduce padding on smaller screens */
  }

  .leaderboard-section h2 {
      font-size: 1.2em; /* Adjust heading size */
      margin-bottom: 10px;
  }
}

@media (max-width: 400px) {
    .search-bar-container {
        flex-direction: column; /* Stack search input and button */
        gap: 10px;
    }

    .search-input {
        width: 100%; /* Full width when stacked */
        max-width: none;
    }

    .clearButton {
        width: 100%; /* Full width when stacked */
        margin-left: 0;
    }
}
</style>