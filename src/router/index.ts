import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/CatalogView.vue')
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/CartView.vue')
        },
        {
            path: '/success',
            name: 'success',
            component: () => import('@/views/ResultView.vue')
        },
        {
            path: '/product/:id',
            name: 'product',
            component: () => import('@/views/ProductView.vue')
        }
    ]
});

export default router;
