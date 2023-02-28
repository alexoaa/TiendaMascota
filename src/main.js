import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from '@/includes/validation';

import './assets/css/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
//? Plugin for client field validations
app.use(VeeValidatePlugin);

app.mount('#app');
