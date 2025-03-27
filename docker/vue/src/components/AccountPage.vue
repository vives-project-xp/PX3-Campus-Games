<template>
  <div class="account-container">
    <h1>Account Details</h1>
    <p>Gebruikersnaam: {{ username }}</p>
    <button class="logout-button" @click="logout">Uitloggen</button>
    <button class="delete-account" @click="deleteAccount">Account verwijderen</button>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
  data() {
    return {
      username: '',
    };
  },
  mounted() {
    this.fetchUsername();
  },
  methods: {
    fetchUsername() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          this.username = payload.username;
        } catch (error) {
          console.error('Error decoding token:', error);
          this.logout();
        }
      } else {
        this.$router.push('/login');
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.username = '';
      this.$router.push('/login');
    },

    async deleteAccount() {
      if (confirm('Ben je zeker dat je dit account permanent wil verwijderen?')) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          alert('Not logged in.');
          return;
        }

        try {
          await axios.delete(`${API_URL}/api/deleteUser/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert('Account deleted successfully.');
          this.logout();
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account.');
        }
      }
    },
  },
};
</script>

<style scoped>
.account-container {
  padding: 20px;
  text-align: center;
}

.account-container h1 {
  margin-bottom: 20px;
}

.logout-button {
  background-color: red;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 20px;
  border: none;
  font-size: 15px;
}

.delete-account {
    background-color: black;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    padding: 10px 20px;
    border: none;
    font-size: 15px;
    margin-left: 10px;
}
</style>