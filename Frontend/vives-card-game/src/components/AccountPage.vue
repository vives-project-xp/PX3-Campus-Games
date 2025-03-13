<template>
    <div class="account-container">
      <div v-if="isLoggedIn">
        <h1>Account Details</h1>
        <p>Gebruikersnaam: {{ username }}</p>
        <button class="logout-button" @click="logout">Log Out</button>
      </div>
      <div v-else>
        <h1>Account</h1>
        <p>You are not logged in yet.</p>
        <p class="login-text">
            <span class="login-link" @click="goToLogin">Log in</span>
        </p>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      username: '',
    };
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
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
        this.isLoggedIn = false;
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/login');
    },

    goToLogin() {
        this.$router.push('/login');
    }
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

.account-container a {
  color: #007bff;
  text-decoration: none;
}

.login-link {
    color: red;
    text-decoration: underline;
    cursor: pointer;
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