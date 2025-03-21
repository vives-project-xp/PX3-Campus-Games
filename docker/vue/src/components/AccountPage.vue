<template>
  <div class="account-container">
    <h1>Account Details</h1>
    <p>Gebruikersnaam: {{ username }}</p>
    <button class="logout-button" @click="logout">Uitloggen</button>
  </div>
</template>

<script>
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
</style>