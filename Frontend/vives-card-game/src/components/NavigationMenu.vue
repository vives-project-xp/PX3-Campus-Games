<template>
  <div class="navigation-bar">
    <button @click="toggleMenu" class="menu-button">
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
    </button>

    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>

    <nav v-if="isMenuOpen" class="menu">
      <router-link to="/" @click="closeMenu">Home</router-link>
      <router-link to="/collection" @click="closeMenu">Collectie</router-link>
      <router-link to="/trading" @click="closeMenu">Ruilen</router-link>
      <router-link to="/battle" @click="closeMenu">battle?</router-link>
      <router-link to="/shop" @click="closeMenu">Winkel</router-link>
      <router-link to="/login" @click="closeMenu">Account</router-link>
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
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    }

    return { isMenuOpen, toggleMenu, closeMenu };
  }
};
</script>

<style scoped>
.navigation-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000; /* Button and menu container */
}

.menu-button {
  background-color: var(--secondary-color);
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;
  height: 40px;
  box-shadow: var(--box-shadow);
}

.menu-button:hover {
  background-color: var(--primary-color);
}

.hamburger-icon {
  width: 100%;
  height: 3px;
  background-color: white;
  margin: 2px 0;
  transition: all 0.3s ease;
}

.menu-button:hover .hamburger-icon {
  background-color: var(--secondary-color);
}

.menu {
  position: fixed;
  bottom: 70px;       /*  <--  Position above the button */
  right: 20px;         /*  <--  Align with button */
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1001;       /*  <--  HIGHER z-index than button and overlay */
  /* Mobile-first:  Make menu full-width on small screens */
  width: auto;        /*  <--  Start with automatic width */
  max-width: calc(100% - 40px); /* <-- Limit width, leave space for button */
}

/* Larger screens - adjust as needed */
@media (min-width: 768px) {
  .menu {
    width: auto; /* Let it take up necessary space on larger screens */
        max-width: 300px;
  }
}

.menu a {
  text-decoration: none;
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease, color 0.2s ease;
  display: block;
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
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    z-index: 999; /*  <--  Below the button and menu, above other content */
}
</style>