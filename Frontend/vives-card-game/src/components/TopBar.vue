<template>
    <div class="top-bar">
      <router-link to="/" class="logo-link">
        <h1>Vives Card Game</h1>
      </router-link>
    </div>
  </template>
  
  <script>
export default {
  name: 'TopBar',
  mounted() {
    const logoText = document.querySelector('.logo-link h1');

    logoText.addEventListener('touchstart', () => {
      logoText.classList.toggle('touched');
    });

    logoText.addEventListener('touchend', () => {
      logoText.classList.toggle('touched');
    });
  }
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
  
  .logo-link{
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    color: var(--secondary-color);
  }
  
  h1 {
    margin: 0;
    font-size: 1.5em;
  }
  </style>