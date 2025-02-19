<template>
  <div id="app">
    <NavigationBar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'; // Correct import

export default {
  name: 'App',
  components: {
    NavigationBar, // Correct component name
  },
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #fff;
  --secondary-color: #e60000;
  --background-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --font-family: 'Open Sans', sans-serif;
  /* Add more variables as needed */
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: var(--text-color);
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Important for layout */
}

main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  flex-grow: 1; /*  <--  CRUCIAL: Allow <main> to fill space */
  width: 100%; /* Add this */
}
</style>