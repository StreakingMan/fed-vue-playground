import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: '首页',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/',
            name: '弹幕机霸',
            component: () => import('../views/DanMuJB.vue'),
        },
    ],
});
