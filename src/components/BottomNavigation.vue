<template>
    <nav class="bottom-navigation">
        <RouterLink to="/" class="nav-item" :class="{ active: $route.name === 'home' }">
            <ShIcon name="home" />
            <span class="nav-label">Каталог</span>
        </RouterLink>

        <RouterLink
            to="/favorites"
            class="nav-item"
            :class="{ active: $route.name === 'favorites' }"
        >
            <ShIcon name="heart" />
            <span class="nav-label">Избранное</span>
        </RouterLink>

        <RouterLink
            to="/cart"
            class="nav-item"
            :class="{ active: $route.name === 'cart' }"
        >
            <ShIcon name="cart" />
            <span class="nav-label">Корзина</span>
            <ShBadge v-if="cartItemCount > 0" :value="cartItemCount" class="cart-badge" />
        </RouterLink>

        <RouterLink
            to="/orders"
            class="nav-item"
            :class="{ active: $route.name === 'orders' }"
        >
            <ShIcon name="orders" />
            <span class="nav-label">Заказы</span>
        </RouterLink>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { ShIcon, ShBadge } from '@/components/UI';
import { computed } from 'vue';
import { useCartStore } from '@/composables/useCartStorage';

const cartStore = useCartStore();
const cartItemCount = computed(() => cartStore.cart.length);

const $route = useRoute();
</script>

<style lang="scss" scoped>
.bottom-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-index-navigation);
    background-color: var(--tg-theme-bg-color, var(--color-white));
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-radius: var(--border-radius);
    text-decoration: none;
    color: var(--tg-theme-hint-color, var(--color-gray-600));
    transition: all 0.2s ease;
    position: relative;
    min-width: 60px;
    --icon-color: var(--tg-theme-hint-color, var(--color-gray-600));

    &:hover {
        color: var(--tg-theme-text-color, var(--color-black));
        --icon-color: var(--tg-theme-text-color, var(--color-black));
        background-color: var(--tg-theme-secondary-bg-color, var(--color-gray-100));
    }

    &.active {
        color: var(--tg-theme-button-color, var(--color-primary));
        --icon-color: var(--tg-theme-hint-color, var(--color-gray-600));
    }
}

.nav-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
}

.cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
}
</style>
