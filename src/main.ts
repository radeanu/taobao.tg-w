import '@/styles/main.scss';
import { init } from '@telegram-apps/sdk-vue';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

init();

const app = createApp(App);
app.use(router);
app.mount('#app');
