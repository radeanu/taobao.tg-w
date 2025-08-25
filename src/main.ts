import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'virtual:svg-icons-register';

import '@/styles/main.scss';
import useDirectives from '@/directives';
import App from './App.vue';
import router from './router';
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

useDirectives(app);

app.mount('#app');

// Set page title with app version
try {
    const baseTitle = document.title || 'Таобао';
    if (typeof APP_VERSION === 'string' && APP_VERSION) {
        document.title = `${baseTitle} v${APP_VERSION}`;
    }
} catch (_) {
    // noop
}
