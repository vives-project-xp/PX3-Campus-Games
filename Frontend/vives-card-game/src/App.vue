<template>
  <div id="app">
    <TopBar />
    <main>
      <router-view></router-view>
    </main>
    <NavigationMenu />
    <BackToTopButton />
  </div>
</template>

<script>
import NavigationMenu from './components/NavigationMenu.vue';
import BackToTopButton from './components/BackToTopButton.vue';
import TopBar from './components/TopBar.vue';

export default {
  name: 'App',
  components: {
    NavigationMenu,
    BackToTopButton,
    TopBar,
  },
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #fff;
  --secondary-color: #e60000;
  --background-color: #fff;
  --text-color: #333;
  --border-color: #ddd;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --font-family: 'Open Sans', sans-serif;
}

html, body {
  margin: 0;
  padding: 5px;
  height: 100%;
  margin-top: 10px;
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
  flex-direction: column;
}

main {
  /*
  padding: 1rem;
  max-width: 1200px;
  */
  margin: 0 auto;
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}
</style>