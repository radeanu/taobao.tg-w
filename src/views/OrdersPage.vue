<template>
    <div class="orders-view">
        <header class="page-header">
            <ShButton
                kind="unstyled"
                label="Новые"
                :class="{
                    'tab-button': true,
                    'tab-button__active': orderType === 'new'
                }"
                @click="orderType = 'new'"
            />
            <ShButton
                kind="unstyled"
                :class="{
                    'tab-button': true,
                    'tab-button__active': orderType === 'archive'
                }"
                label="Архив"
                @click="orderType = 'archive'"
            />
        </header>

        <ShSkeleton v-if="loading.isLoading.value" class="skeleton" />

        <div v-else class="orders-content">
            <div v-if="orders.length === 0" class="empty-state">
                <ShIcon name="orders" class="empty-icon" />
                <h2 class="empty-title">Нет заказов</h2>
                <p class="empty-description">
                    История заказов появится здесь после первой покупки
                </p>
                <RouterLink to="/" class="browse-button"> Начать покупки </RouterLink>
            </div>

            <div v-else class="orders-list">
                <OrderItem v-for="order in orders" :key="order.id" :order="order" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { ShButton, ShIcon, ShSkeleton } from '@/components/UI';
import { useClientOrders } from '@/composables/useClientOrders';
import OrderItem from '@/components/OrderItem.vue';

const { orders, loading, orderType } = useClientOrders();
</script>

<style lang="scss" scoped>
.orders-view {
    padding: 20px 8px;
    padding-bottom: 100px;
    padding-top: 0;
}

.skeleton {
    margin-top: 20px;
    width: 100%;
    height: 200px;
    min-height: 200px;
    max-height: 200px;
    border-radius: var(--border-radius-m);
}

.page-header {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    column-gap: 10px;
    width: 100vw;
    margin-left: calc(var(--layout-pad-y) / 2 * -1);

    .tab-button {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--tg-theme-bg-color, var(--color-grey2));

        &__active {
            color: var(--tg-theme-button-text-color, inherit);
            background-color: var(--tg-theme-button-color, var(--color-white));
        }
    }
}

.orders-content {
    padding-block: var(--layout-pad-x);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
