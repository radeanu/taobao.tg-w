<template>
    <div class="orders-view">
        <header class="page-header">
            <h1 class="page-title">Orders</h1>
        </header>

        <div class="orders-content">
            <div class="empty-state">
                <ShIcon name="orders" class="empty-icon" />
                <h2 class="empty-title">No orders yet</h2>
                <p class="empty-description">
                    Your order history will appear here once you make your first purchase
                </p>
                <RouterLink to="/" class="browse-button"> Start Shopping </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ShIcon } from '@/components/UI';
</script>

<style lang="scss" scoped>
.orders-view {
    min-height: 100vh;
    padding-bottom: 80px; // Space for bottom navigation
}

.page-header {
    padding: var(--layout-pad-y) var(--layout-pad-x);
    border-bottom: 1px solid var(--tg-theme-hint-color, var(--color-gray-200));
    background-color: var(--tg-theme-bg-color, var(--color-white));
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--tg-theme-text-color, var(--color-black));
    margin: 0;
}

.orders-content {
    padding: var(--layout-pad-y) var(--layout-pad-x);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    width: 64px;
    height: 64px;
    color: var(--tg-theme-hint-color, var(--color-gray-400));
    margin-bottom: 24px;
}

.empty-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--tg-theme-text-color, var(--color-black));
    margin: 0 0 12px 0;
}

.empty-description {
    font-size: 16px;
    color: var(--tg-theme-hint-color, var(--color-gray-600));
    margin: 0 0 32px 0;
    line-height: 1.5;
}

.browse-button {
    display: inline-block;
    padding: 12px 24px;
    background-color: var(--tg-theme-button-color, var(--color-primary));
    color: var(--tg-theme-button-text-color, var(--color-white));
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: 500;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
}
</style>
