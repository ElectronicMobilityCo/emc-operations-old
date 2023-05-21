import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './ui/styles/base.css';

import { router } from './router';

import OpsVueApplication from './application.vue';

const app = createApp(OpsVueApplication);

const pinia = createPinia();
app.use(pinia);

app.use(router);

setTimeout(() => app.mount('#eo-app'), 900);
