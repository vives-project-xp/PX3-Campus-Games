<template>
  <div class="top-bar">
    <a href="#" class="logo-link" @click.prevent="handleClick">
      <h1>Vives Collectica</h1>
    </a>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'TopBar',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    const handleClick = () => {
      if (route.path === '/') {
        scrollToTop();
      } else {
        router.push('/');
      }
    };
    return { handleClick };
  }
};
</script>
  
  <style scoped>
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--primary-color);
    padding: 10px 20px;
    box-shadow: var(--box-shadow);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .logo-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .logo-link:hover {
      color: var(--secondary-color);
  }
  
  h1 {
    margin: 0;
    font-size: 1.5em;
  }
  </style>