<template>
  <div id="app">
    <TopBar />
    <Background class="background"/>
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
import Background from './components/Background.vue';

export default {
  name: 'App',
  components: {
    NavigationMenu,
    BackToTopButton,
    TopBar,
    Background,
  },
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #fff;
  --secondary-color: #e60000;
  --text-color: #333;
  --border-color: #ddd;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --font-family: 'Open Sans', sans-serif;
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: var(--text-color);
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

main {
  margin: 0 auto;
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

html, body {
  padding: 0rem 1rem 0rem 1rem;
  margin-top: 1rem;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -100;
  pointer-events: none; /* Optional: allows clicks to pass through */
}
</style>