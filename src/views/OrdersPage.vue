<template>
    <div class="orders-view">
        <header class="page-header">
            <ShButton
                kind="unstyled"
                label="Новые"
                :class="{
                    'tab-button': true,
                    'tab-button__active': activeTab === 'new'
                }"
                @click="activeTab = 'new'"
            />
            <ShButton
                kind="unstyled"
                :class="{
                    'tab-button': true,
                    'tab-button__active': activeTab === 'archive'
                }"
                label="Архив"
                @click="activeTab = 'archive'"
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
                <div v-for="order in orders" :key="order.id" class="order">
                    <div class="order__header">
                        <div class="order__id">Заказ №{{ order.number }}</div>
                        <div
                            class="order__status"
                            :class="`order__status--${order.status?.toLowerCase() ?? 'new'}`"
                        >
                            {{ getStatusText(order.status) }}
                        </div>
                    </div>
                    <div class="order__details">
                        <div class="order__date">
                            {{ formatDate(order.createdAt) }}
                        </div>
                        <div class="order__price">{{ formatPrice(order.price) }} ₽</div>
                    </div>
                    <div class="order__positions">
                        <div class="positions-count">
                            {{ order.positions.length }}
                            {{ getPositionsText(order.positions.length) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { RouterLink } from 'vue-router';
import { ShButton, ShIcon, ShSkeleton } from '@/components/UI';
import { useClientOrders } from '@/composables/useClientOrders';

const activeTab = ref<'new' | 'archive'>('new');

const { orders, loading } = useClientOrders();

function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        new: 'Новый',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменен'
    };

    return statusMap?.[status?.toLowerCase() ?? 'new'];
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatPrice(price: number): string {
    return price.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    });
}

function getPositionsText(count: number): string {
    if (count === 1) return 'позиция';
    if (count >= 2 && count <= 4) return 'позиции';
    return 'позиций';
}
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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 10px;

    .tab-button {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--tg-theme-bg-color, var(--color-grey2));

        &__active {
            color: var(--tg-theme-button-text-color, var(--color-white));
            background-color: var(--tg-theme-button-color, var(--color-white));
        }
    }
}

.orders-content {
    padding: var(--layout-pad-y) var(--layout-pad-x);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order {
    background-color: var(--tg-theme-bg-color, var(--color-white));
    border: 1px solid var(--tg-theme-hint-color, var(--color-gray-200));
    border-radius: var(--border-radius);
    padding: 16px;
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    &__id {
        font-size: 16px;
        font-weight: 600;
        color: var(--tg-theme-text-color, var(--color-black));
    }

    &__status {
        padding: 4px 8px;
        border-radius: var(--border-radius-s);
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;

        &--new {
            background-color: #e3f2fd;
            color: #1976d2;
        }

        &--processing {
            background-color: #fff3e0;
            color: #f57c00;
        }

        &--shipped {
            background-color: #e8f5e8;
            color: #388e3c;
        }

        &--delivered {
            background-color: #e8f5e8;
            color: #2e7d32;
        }

        &--cancelled {
            background-color: #ffebee;
            color: #d32f2f;
        }
    }

    &__details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    &__date {
        font-size: 14px;
        color: var(--tg-theme-hint-color, var(--color-gray-600));
    }

    &__price {
        font-size: 16px;
        font-weight: 600;
        color: var(--tg-theme-text-color, var(--color-black));
    }

    &__positions {
        .positions-count {
            font-size: 14px;
            color: var(--tg-theme-hint-color, var(--color-gray-600));
        }
    }
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
