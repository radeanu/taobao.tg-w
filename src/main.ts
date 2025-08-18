import '@/styles/main.scss';
import { init } from '@telegram-apps/sdk';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
const app = createApp(App);

app.use(router);

app.mount('#app');
init();
