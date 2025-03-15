<template>
    <div class="top-bar">
      <router-link to="/" class="logo-link">
        <h1>Vives Collectica</h1>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopBar',
  };
  </script>
  
  <style scoped>
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--primary-color);
    padding: 10px 20px;
    box-shadow: var(--box-shadow);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .logo-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .logo-link:hover {
      color: var(--secondary-color);
  }
  
  h1 {
    margin: 0;
    font-size: 1.5em;
  }
  </style>