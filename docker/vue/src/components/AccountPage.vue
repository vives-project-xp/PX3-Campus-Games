<template>
  <div class="account-container">
    <h1>Account Details</h1>

    <div class="info-grid">
      <div class="info-box username-box">
        <span class="label">Gebruikersnaam:</span>
        <span class="value">{{ username }}</span>
      </div>

      <div class="info-box total-cards-box">
        <span class="label">Verzamelde Kaarten:</span>
        <span class="value">{{ totalCards }}</span>
      </div>

      <div class="info-box userid-box">
        <span class="label">Gebruikers ID:</span>
        <span class="value">{{ userId }}</span>
      </div>
    </div>

    <div class="actions-box">
      <button class="action-button logout-button" @click="logout">Uitloggen</button>
      <button class="action-button delete-account-button" @click="deleteAccount">Account verwijderen</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const totalCards = ref(0);
    const userId = localStorage.getItem('userId');
    const router = useRouter();

    const fetchUsername = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          username.value = payload.username;
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      } else {
        router.push('/login');
      }
    };

    const fetchTotalCards = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_URL}/api/userCards/${userId}`);
          totalCards.value = response.data.length;
        } catch (error) {
          console.error('Error fetching user cards for total count:', error);
          totalCards.value = 0;
        }
      } else {
        totalCards.value = 0;
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      username.value = '';
      router.push('/login');
    };

    const deleteAccount = async () => {
      if (confirm('Ben je zeker dat je dit account permanent wil verwijderen?')) {
        const token = localStorage.getItem('token');

        try {
          await axios.delete(`${API_URL}/api/deleteUser/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert('Account succesvol verwijderd.');
          logout();
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Er is een error opgetreden tijdens het verwijderen van het account.');
        }
      }
    };

    onMounted(() => {
      fetchUsername();
      fetchTotalCards();
    });

    return {
      username,
      totalCards,
      logout,
      deleteAccount,
      userId,
    };
  },
};
</script>

<style scoped>
/* reset */
body, html, main {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fff; /* White background */
    color: #333; /* Dark text color */
    font-family: sans-serif;
    min-height: 100vh; /* Ensure body/html take at least full viewport height */
    display: flex; /* Use flexbox for centering content */
    justify-content: center; /* Center content horizontally */
    align-items: flex-start; /* Align content to the top */
}

.account-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 750px; /* Max width on desktop */
    margin: 40px auto; /* Center the container */
    background-color: #fff; /* White background for container */
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

h1 {
    color: red;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    width: 100%;
    margin-bottom: 30px;
}

.info-box {
    background-color: #eaeaea;
    border: 2px solid #ff4d4d;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.info-box .label {
    font-size: 1.1em;
    font-weight: semi-bold;
    color: #373737;
    margin-bottom: 5px;
}

.info-box .value {
    font-size: 1.2em;
    font-weight: bold;
    color: #222;
}

.actions-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    width: 100%;
    padding: 20px;
    background-color: #eaeaea;
    border: 2px solid #ff4d4d;
    border-radius: 8px;
    box-sizing: border-box;
}

.action-button {
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    letter-spacing: 1px;
    font-weight: bold;
}

.logout-button {
    background-color: red;
    color: white;
}

.delete-account-button {
    background-color: black;
    color: white;
}

@media (max-width: 480px) {
    .account-container {
        margin: 40px auto;
    }

    h1 {
        font-size: 1.5em;
        margin-bottom: 20px;
    }

    .info-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .info-box {
        padding: 10px;
    }

    .info-box .label {
        font-size: 0.8em;
    }

    .info-box .value {
        font-size: 1em;
    }

    .action-button {
        padding: 10px 15px;
    }

    .actions-box {
        gap: 10px;
        padding: 15px;
        flex-direction: column;
        align-items: center;
    }

    .actions-box .action-button {
         width: 100%;
    }
}
</style>