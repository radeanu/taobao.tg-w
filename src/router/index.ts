import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/CatalogPage.vue')
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('@/views/FavoritesPage.vue')
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/CartPage.vue')
        },
        {
            path: '/orders',
            name: 'orders',
            component: () => import('@/views/OrdersPage.vue')
        },
        {
            path: '/success',
            name: 'success',
            component: () => import('@/views/ResultPage.vue')
        },
        {
            path: '/product/:id',
            name: 'product',
            component: () => import('@/views/ProductPage.vue')
        }
    ]
});

export default router;
