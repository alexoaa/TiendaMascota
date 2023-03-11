import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import MainView from '@/views/MainView.vue';
import AdminView from '@/views/AdminView.vue';
import useUserStore from '@/stores/user';

const routes = [
  { name: 'home', path: '/', component: MainView },
  { name: 'admin', path: '/admin', component: AdminView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  /* If the condition ends up not passing, we know that the route does require authentication.
  This means we should check the store for the user's authentication status.
  First, we need the store at the top of the router file.
  https://www.udemy.com/course/complete-vue-js-developer-zero-to-mastery-vuex/learn/lecture/25064040#questions*/
  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  try {
    const response = await axios.get('/admin');
    this.catalogo = response.data;
  } catch (error) {
    console.log(error);
  }

  const store = useUserStore();

  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
