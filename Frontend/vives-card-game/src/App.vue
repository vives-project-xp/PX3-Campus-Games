<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppHeader from './components/NavigationBar.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
  },
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #fff; /* Changed to white */
  --secondary-color: #e60000; /* Vives Red (approximate) - Use your school's official hex code */
  --background-color: #f5f5f5; /* Light gray background */
  --text-color: #333;        /* Dark gray for text */
  --border-color: #ddd;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 8px; /* Consistent rounded corners */
  --font-family: 'Open Sans', sans-serif; /* Example - choose your font! */
  /* Add more variables as needed */
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left; /* Removed center alignment */
  color: var(--text-color);
  background-color: var(--background-color); /* Use background color */
  min-height: 100vh; /* Ensure the app takes at least the full viewport height */
  display: flex;
  flex-direction: column; /* Stack header and main content vertically*/
}

main {
  padding: 20px;
  max-width: 1200px;  /* Limit content width for better readability on large screens */
  margin: 0 auto;      /* Center the content horizontally */
  flex-grow: 1;        /* Allow main content to fill available space */
}
</style>