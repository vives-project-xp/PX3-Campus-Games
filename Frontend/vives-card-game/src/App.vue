<template>
  <div id="app">
    <NavigationBar />
    <main>
      <router-view></router-view>
    </main>
    <BackToTopButton />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';
import BackToTopButton from './components/BackToTopButton.vue';

export default {
  name: 'App',
  components: {
    NavigationBar,
    BackToTopButton,
  },
};
</script>

<style>
:root {
  --primary-color: #fff;
  --secondary-color: #e60000;
  --background-color: #f5f5f5;
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  padding: 20px;
  padding-top: 60px;
  max-width: 1200px;
  margin: 0 auto;
  flex-grow: 1;
  width: 100%;
}
</style>