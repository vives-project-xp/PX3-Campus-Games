<template>
    <header>
      <h1>Vives Card Game</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/collection">Collection</router-link>
        <router-link to="/trading">Trade</router-link>
        <router-link to="/battle">Battle</router-link>
        <router-link to="/shop">Shop</router-link>
        <router-link to="/account">Account</router-link>
        </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'site-header'
  };
  </script>
  
  <style scoped>
  header {
    background-color: #f0f0f0;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px;
    font-size: large;
  }
  
  nav {
    display: flex;
    gap: 20px;
  }
  
  nav a {
    text-decoration: none;
    color: #2c3e50;
    padding: 5px 10px;
    border-radius: 5px;
  }
  
  nav a.router-link-exact-active {
    background-color: #2c3e50;
    color: white;
  }
  
  h1 {
      margin: 0;
  }
  </style>