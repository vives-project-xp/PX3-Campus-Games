<template>
  <button
    v-if="showButton"
    @click="scrollToTop"
    class="back-to-top-button"
    :style="{ backgroundColor: backToTopColor }"
  >
    ↑  </button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'BackToTopButton',
  props:{
      backToTopColor: {
          type: String,
          default: '#e60000'
      }
  },
  setup() {
    const showButton = ref(false);
    const scrollThreshold = 200;

    const handleScroll = () => {
      showButton.value = window.scrollY > scrollThreshold;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return { showButton, scrollToTop };
  }
};
</script>

<style scoped>
.back-to-top-button {
  position: fixed;
  bottom: 70px;
  right: 20px;
  /* background-color: var(--secondary-color); Use dynamic backgroundColor */
  color: white;
  border: none;
  padding: 0;        /*  <-- REMOVE padding (we'll control size with width/height) */
  width: 40px;      /*  <-- Set a fixed width */
  height: 40px;     /*  <-- Set a fixed height (same as width for a circle) */
  border-radius: 50%; /*  <-- Makes it perfectly round */
  cursor: pointer;
  font-size: 20px;
  z-index: 998;   /*  <--  Slightly lower z-index than the menu */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.back-to-top-button:hover {
  opacity: 1;
}
</style>