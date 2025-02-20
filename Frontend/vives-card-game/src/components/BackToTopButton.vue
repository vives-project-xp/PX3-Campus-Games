<template>
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="back-to-top-button"
      :style="{ backgroundColor: backToTopColor }"
    >
      ↑
    </button>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  export default {
    name: 'BackToTopButton',
    props: {
        backToTopColor: {
        type: String,
        default: '#e60000' // Default to your secondary color (Vives red)
      },
    },
    setup() {
      const showButton = ref(false);
      const scrollThreshold = 200; // Distance in pixels to show the button
  
      const handleScroll = () => {
        showButton.value = window.scrollY > scrollThreshold;
      };
  
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Smooth scrolling
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
    position: fixed; /* Fixed position - stays on screen */
    bottom: 20px;   /* Distance from the bottom */
    right: 20px;    /* Distance from the right */
    /* background-color: var(--secondary-color);  Use the color in props */
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 50%; /* Circular button */
    cursor: pointer;
    font-size: 20px;
    z-index: 1000;   /* Ensure it's above other content */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Optional shadow */
    opacity: 0.8; /* Add a little transparency*/
    transition: opacity 0.3s ease;
  }
  
  .back-to-top-button:hover {
      opacity: 1;
  }
  </style>