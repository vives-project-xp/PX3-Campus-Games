import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import CollectionPage from './components/CollectionPage.vue';
import BattlePage from './components/BattlePage.vue';
import ShopPage from './components/ShopPage.vue';
import HomePage from './components/HomePage.vue';

const routes = [
  { path: '/', component: HomePage }, // Use HomePage for the root route
  { path: '/collection', component: CollectionPage },
  { path: '/battle', component: BattlePage },
  { path: '/shop', component: ShopPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router); // Use the router
app.mount('#app');
