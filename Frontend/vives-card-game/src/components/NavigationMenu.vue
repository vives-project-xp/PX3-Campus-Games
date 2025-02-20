<template>
  <div class="navigation-menu">
    <button @click="toggleMenu" class="menu-button">
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
    </button>

    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>

    <nav v-if="isMenuOpen" class="menu">
      <router-link to="/" @click="closeMenu">Home</router-link>
      <router-link to="/collection" @click="closeMenu">Collection</router-link>
      <router-link to="/battle" @click="closeMenu">Battle</router-link>
      <router-link to="/shop" @click="closeMenu">Shop</router-link>
      <router-link to="/account" @click="closeMenu">Account</router-link>
    </nav>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'navigation-menu',
  setup() {
    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value; // Toggle the menu state
    };
    const closeMenu = () => {
      isMenuOpen.value = false;
    }

    return { isMenuOpen, toggleMenu, closeMenu };
  }
};
</script>

<style scoped>
.navigation-menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000; /* Ensure it's above other content */
}

.menu-button {
  background-color: var(--secondary-color);
  border: none;
  padding: 10px;
  border-radius: 50%; /* Circular button */
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40px; /* Adjust as needed */
  height: 40px; /* Adjust as needed */
  box-shadow: var(--box-shadow);
}
.menu-button:hover {
    background-color: var(--primary-color);
}
.hamburger-icon {
  width: 100%;
  height: 3px;
  background-color: white;
  margin: 2px 0; /* Space between lines */
  transition: all 0.3s ease;
}
.menu-button:hover .hamburger-icon {
    background-color: var(--secondary-color);
}

.menu {
  position: fixed;
  bottom: 80px;  /* Position it above the button.  Adjust as needed. */
  right: 20px;   /* Same right position as the button */
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between links */
  z-index: 1001;
}

.menu a {
  text-decoration: none;
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease, color 0.2s ease;
  display: block; /* Make links block-level for easier clicking */
}

.menu a:hover,
.menu a.router-link-exact-active {
  background-color: var(--secondary-color);
  color: white;
}
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.35);
    z-index: 1000;
}
</style>