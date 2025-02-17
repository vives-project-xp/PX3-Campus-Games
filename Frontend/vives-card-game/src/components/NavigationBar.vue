<template>
  <header>
    <router-link to="/" class="logo-link">
      <h1>Vives Card Game</h1>
    </router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/collection">Collection</router-link>
      <router-link to="/battle">Battle</router-link>
      <router-link to="/shop">Shop</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'navigation-bar'
};
</script>

<style scoped>
header {
  background-color: var(--primary-color);
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
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

/* Style for the logo link (optional, but good for visual feedback) */
.logo-link {
  text-decoration: none; /* Remove underline */
  color: inherit;        /* Inherit text color from parent (header) */
  cursor: pointer;       /* Change cursor to pointer on hover */
}
.logo-link:hover{
    color: var(--secondary-color);
}
</style>