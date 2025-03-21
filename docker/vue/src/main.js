import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import CollectionPage from './components/CollectionPage.vue';
import BattlePage from './components/BattlePage.vue';
import ShopPage from './components/ShopPage.vue';
import HomePage from './components/HomePage.vue';
import TradingPage from './components/TradingPage.vue';
import AccountPage from './components/AccountPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import StarterPackPage from './components/StarterPackPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/collection', component: CollectionPage },
  { path: '/battle', component: BattlePage },
  { path: '/shop', component: ShopPage },
  { path: '/trading', component: TradingPage },
  { path: '/account', component: AccountPage },
  { path: '/login', component: LoginPage },
  {path: '/register', component: RegisterPage},
  { path: '/starter-pack', component: StarterPackPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
