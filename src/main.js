import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from '@/includes/validation';
// import axios from 'axios';

import './assets/css/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
// app.use(axios);
//? Plugin for client field validations
app.use(VeeValidatePlugin);

app.mount('#app');
