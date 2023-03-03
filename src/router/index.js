import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import AdminView from '@/views/AdminView.vue';

const routes = [
  { name: 'home', path: '/', component: MainView },
  { name: 'admin', path: '/admin', component: AdminView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
