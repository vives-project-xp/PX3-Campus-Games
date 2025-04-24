<template>
  <div class="account-container">
    <h1>Account Details</h1>
    <div class="info-box">
      <p class="userName">Gebruikersnaam: {{ username }}</p>
      <p class="totalCards">Totaal aantal verzamelde kaarten: {{ totalCards }}</p>
      <p class="userId">Gebruikers ID: {{ userId }}</p>
    </div>
    <div class="actions-box">
      <button class="logout-button" @click="logout">Uitloggen</button>
      <button class="delete-account" @click="deleteAccount">Account verwijderen</button>
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
.account-container {
  padding: 20px; /* Default padding for larger screens */
  text-align: center;
  display: grid;
  grid-template-areas:
    'title'
    'info'
    'actions';
  gap: 20px;
  width: 90%; /* Add a percentage width to prevent it from taking full width on larger screens */
  max-width: 600px; /* Optional: set a maximum width for larger screens */
  margin: 0 auto; /* Center the container on larger screens */
}

@media (max-width: 600px) {
  .account-container {
    padding: 10px; /* Reduce padding for smaller screens */
    width: 100%; /* Take full width on smaller screens */
    margin: 0; /* Remove margin on smaller screens */
  }
}

.account-container h1 {
  grid-area: title;
  margin-bottom: 0;
}

.info-box {
  grid-area: info;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9; /* Light background */
  border-radius: 10px; /* Rounded corners */
  padding: 20px; /* Padding inside the box */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.userName,
.totalCards,
.userId {
  margin: 5px 0;
  font-size: 18px;
  font-weight: bolder;
}

.actions-box {
  grid-area: actions;
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: #f9f9f9; /* Light background */
  border-radius: 10px; /* Rounded corners */
  padding: 15px; /* Padding inside the box */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout-button {
  background-color: red;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 20px;
  border: none;
  font-size: 15px;
  width: 150px; /* Added a width for better visual */
}

.delete-account {
  background-color: black;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 20px;
  border: none;
  font-size: 15px;
  width: 150px; /* Added a width for better visual */
  margin-left: 0; /* Resetting the margin as flexbox in actions-box handles spacing */
}
</style>