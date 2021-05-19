import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import '@mdi/font/css/materialdesignicons.css';
import './styles/index.scss';

const app = createApp(App);

app.use(router);

app.mount('#app');
