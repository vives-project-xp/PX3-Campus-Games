<template>
  <header :style="{ width: headerWidth }">
    <router-link to="/" class="logo-link">
      <h1>Vives Card Game</h1>
    </router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/collection">Collection</router-link>
      <router-link to="/trading">Trading</router-link>
      <router-link to="/battle">Battle</router-link>
      <router-link to="/shop">Shop</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue'; // onUnmounted removed

export default {
  name: 'navigation-bar',
  setup() {
    const headerWidth = ref('100%'); // Default to 100%

    const calculateScrollbarWidth = () => {
      // Create a div
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll'; // Force scrollbar
      document.body.appendChild(outer);

      // Create an inner div
      const inner = document.createElement('div');
      outer.appendChild(inner);

      // Calculate the difference (scrollbar width)
      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

      // Remove the divs
      outer.parentNode.removeChild(outer);

      return scrollbarWidth;
    };

    onMounted(() => {
      const scrollbarWidth = calculateScrollbarWidth();
      headerWidth.value = `calc(100% - ${scrollbarWidth}px)`;
    });

    return { headerWidth };
  }
};
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--primary-color);
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
  z-index: 100;
}

nav {
  display: flex;
  gap: 25px;
}

nav a {
  text-decoration: none;
  color: var(--text-color);
  padding: 8px 15px;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease, color 0.2s ease;
}

nav a:hover {
    color: var(--secondary-color);
}

nav a.router-link-exact-active {
  background-color: var(--secondary-color);
  color: white;
}

h1 {
  margin: 0;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.logo-link:hover{
    color: var(--secondary-color);
}
</style>