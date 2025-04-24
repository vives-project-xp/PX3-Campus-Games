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
              <tr v-for="user in filteredUserLeaderboard" :key="user.id" :class="{ 'first': originalIndex(user.id) === 0, 'second': originalIndex(user.id) === 1, 'third': originalIndex(user.id) === 2 }">
                <td>
                   <span v-if="originalIndex(user.id) === 0" class="rank-emoji">🥇</span>
                  <span v-else-if="originalIndex(user.id) === 1" class="rank-emoji">🥈</span>
                  <span v-else-if="originalIndex(user.id) === 2" class="rank-emoji">🥉</span>
                  <span v-else>{{ originalIndex(user.id) + 1 }}</span>
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
import { API_URL } from '../config'; // Zorg dat dit pad correct is
import axios from 'axios';
// import { useRoute } from 'vue-router'; // Importeer useRoute indien nodig (was in originele code)

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

    // Nieuwe ref voor de zoekterm
    const searchQuery = ref('');

    // const route = useRoute(); // Haal route op indien nodig

    const fetchUserLeaderboard = async () => {
      userLoading.value = true;
      userError.value = null;
      usernameMap.value.clear(); // Leeg de map bij opnieuw ophalen
      try {
        const response = await axios.get(`${API_URL}/api/getUsersScores`);
        // Sorteer meteen op score (hoog naar laag) als de API dat nog niet doet
        userLeaderboard.value = response.data.sort((a, b) => b.user_score - a.user_score);

        // Haal alle usernames tegelijk op (efficiënter)
        const userIds = userLeaderboard.value.map(user => user.id);
        if (userIds.length > 0) {
           // Aanname: je hebt een API endpoint dat meerdere usernames kan ophalen
           // Als dat niet zo is, gebruik de oude for-loop
           // Voorbeeld: const usernamesResponse = await axios.post(`${API_URL}/api/getUsernamesByIds`, { ids: userIds });
           // Pas de code hieronder aan op basis van de response van je API

           // Oude manier (minder efficiënt, maar werkt met je huidige getUserScoreById):
          await Promise.all(userLeaderboard.value.map(async (user) => {
            try {
              const userResponse = await axios.get(`${API_URL}/api/getUserScoreById/${user.id}`);
              usernameMap.value.set(user.id, userResponse.data.username);
            } catch (userFetchError) {
              console.error(`Error fetching username for user ${user.id}:`, userFetchError);
              usernameMap.value.set(user.id, 'Onbekende Gebruiker'); // Geef een fallback naam
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
            // Sorteer meteen op score (hoog naar laag)
            educationLeaderboard.value = response.data.sort((a, b) => b.total_score - a.total_score);

            if (educationLeaderboard.value.length > 0) {
                 // De hoogste staat nu altijd bovenaan na het sorteren
                topEducation.value = educationLeaderboard.value[0].opleiding;
            } else {
                topEducation.value = null; // Reset als er geen data is
            }

        } catch (err) {
            console.error('Error fetching education leaderboard:', err);
            educationError.value = 'Kan opleiding scorebord niet ophalen.';
        } finally {
            educationLoading.value = false;
        }
    };

    // Computed property om de gebruikerslijst te filteren
    const filteredUserLeaderboard = computed(() => {
      if (!searchQuery.value) {
        return userLeaderboard.value; // Geef de volledige lijst terug als er geen zoekterm is
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase();
      return userLeaderboard.value.filter(user => {
        const username = usernameMap.value.get(user.id)?.toLowerCase();
        return username && username.includes(lowerCaseQuery);
      });
    });

     // Functie om de originele index (rank) te vinden, zelfs na filteren
    const originalIndex = (userId) => {
        return userLeaderboard.value.findIndex(user => user.id === userId);
    };

    const clearSearch = () => {
      searchQuery.value = ''; // Reset de zoekterm
    };

    // Haal de data op bij het mounten van de component
    onMounted(() => {
      fetchUserLeaderboard();
      fetchEducationLeaderboard();
    });

    // Exposeer alles wat nodig is in de template
    return {
      userLeaderboard, // Originele lijst nog steeds nodig voor originalIndex
      userLoading,
      userError,
      usernameMap, // Nog steeds nodig voor weergave
      educationLeaderboard,
      educationLoading,
      educationError,
      topEducation,
      searchQuery, // Voor de v-model van de input
      clearSearch, // Voor de clear button
      filteredUserLeaderboard, // Voor de v-for loop
      originalIndex // Voor het bepalen van de rank en stijl
      // getUsername, // Niet meer direct nodig in template, maar kan blijven als helper
      // isLeaderboardRoute, // Alleen nodig als je logica hebt die afhangt van de route
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
  min-width: 300px; /* Voorkomt dat de secties te smal worden */
}

/* Styling voor de zoekbalk container */
.search-bar-container {
    width: 100%;
    margin-bottom: 15px; /* Ruimte onder de zoekbalk */
    display: flex;
    justify-content: center; /* Centreer de zoekbalk in de sectie */
    align-items: center; /* Centreer de inhoud verticaal */
}

/* Styling voor de zoekbalk zelf */
.search-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 90%;
    max-width: 400px;
    font-size: 1rem;
    height: 38px;
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
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.leaderboard-table th {
  background-color: #f2f2f2;
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
    color: gold;
    font-weight: bold;
}

.clearButton {
  background: #e60000;
  cursor: pointer;
  font-size: 1.5rem; /* Bepaalt grootte van de 'X' */
  color: white;
  margin-left: 10px; /* Houdt ruimte tussen input en button */
  border: none;
  border-radius: 5px; /* Behoud afronding */

  /* --- Toegevoegd/Aangepast voor centreren --- */
  display: inline-flex; /* Maakt flexbox mogelijk binnen de button */
  align-items: center;  /* Verticaal centreren van de 'X' */
  justify-content: center; /* Horizontaal centreren van de 'X' */
  line-height: 1;      /* Voorkomt dat extra lijnhoogte stoort */
  /* Optioneel: Vaste grootte instellen indien nodig om beter bij input te passen */
  height: 38px; /* Probeer dit in te stellen op ongeveer de hoogte van de input */
  width: 38px;  /* Maak het vierkant indien gewenst */
  padding: 0.4em 0.5em 0.3em 0.5em;
  box-sizing: border-box; /* Zorgt dat padding binnen de height/width valt */
}

@media (max-width: 800px) {
  .leaderboards-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .leaderboard-section {
    width: 95%;
    margin: 15px 0;
  }

  .search-input {
      width: 90%; /* Meer breedte op mobiel */
  }
}
</style>