import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Import
import CollectionPage from './components/CollectionPage.vue'; // Import your route components
import BattlePage from './components/BattlePage.vue';
import ShopPage from './components/ShopPage.vue';


// Define your routes
const routes = [
  { path: '/', component: CollectionPage }, // Use CollectionPage as the home page for now
  { path: '/collection', component: CollectionPage },
  { path: '/battle', component: BattlePage },
  { path: '/shop', component: ShopPage },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create the Vue app and use the router
const app = createApp(App);
app.use(router); // Use the router
app.mount('#app');
