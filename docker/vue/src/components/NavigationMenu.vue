<template>
  <div class="navigation-bar">
    <button @click="toggleMenu" class="menu-button">
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
      <span class="hamburger-icon"></span>
      <span v-if="hasDailyReward" class="notification-badge"></span>
    </button>

    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>

    <nav v-if="isMenuOpen" class="menu">
      <router-link to="/" @click="closeMenu">Home</router-link>
      <router-link to="/leaderboard" @click="closeMenu">Scorebord</router-link>
      <router-link to="/collection" @click="closeMenu">Collectie</router-link>
      <router-link to="/codex" @click="closeMenu">Codex</router-link>
      <router-link to="/trading" @click="closeMenu">Ruilen</router-link>
      <router-link to="/game" @click="closeMenu">Game</router-link>
      <!--<router-link to="/shop" @click="closeMenu">Winkel</router-link>-->
      <router-link to="/daily" @click="closeMenu">
        Dagelijkse Beloning
        <span v-if="hasDailyReward" class="menu-notification">!</span>
      </router-link>
      <router-link to="/account" @click="closeMenu">Account</router-link>
    </nav>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { API_URL } from '../config';

export default {
  name: 'navigation-menu',
  setup() {
    const isMenuOpen = ref(false);
    const hasDailyReward = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    const checkDailyRewardAvailability = async () => {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) return;

        const response = await fetch(`${API_URL}/api/daily/check`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          hasDailyReward.value = data.hasReward;
        }
      } catch (error) {
        console.error('Error checking daily reward:', error);
      }
    };

    onMounted(() => {
      checkDailyRewardAvailability();
      // Controleer periodiek (elke 5 minuten)
      const interval = setInterval(checkDailyRewardAvailability, 300000);
      return () => clearInterval(interval);
    });

    return { isMenuOpen, hasDailyReward, toggleMenu, closeMenu };
  }
};
</script>

<style scoped>
/* Bestaande stijl blijft hetzelfde, voeg deze toe: */
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background-color: #ff4757;
  border-radius: 50%;
  border: 2px solid var(--secondary-color);
}

.menu-button {
  position: relative; /* Voor absolute positionering van de badge */
}

.menu-notification {
  display: inline-block;
  margin-left: 8px;
  width: 18px;
  height: 18px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: bold;
}

/* Bestaande stijl blijft hetzelfde */
.navigation-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
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
  bottom: 70px;
  right: 20px;
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1001;
  width: auto;
  max-width: calc(100% - 40px);
}

@media (min-width: 768px) {
  .menu {
    width: auto;
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
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>