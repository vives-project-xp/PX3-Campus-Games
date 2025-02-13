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
    padding: 10px;
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
    border-color: #e00020;
  }
  
  nav a {
    text-decoration: none;
    color: #2c3e50;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 125%;
  }
  
  nav a.router-link-exact-active {
    background-color: #e00020;
    color: white;
  }
  
  h1 {
      margin: 0;
      font-size: 50px;
  }
  </style>