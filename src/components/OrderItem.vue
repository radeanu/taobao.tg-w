<template>
    <div class="order">
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
            <div class="order__price">{{ formatPrice(order.price) }}</div>
        </div>

        <div class="order__positions">
            <div class="positions-wrapper">
                <div class="positions-count" @click="showDetails = !showDetails">
                    {{ order.positions.length }}
                    {{ getPositionsText(order.positions.length) }}
                </div>
                <ShButton
                    v-if="showDetails"
                    class="positions-hide-btn"
                    kind="unstyled"
                    label="Скрыть"
                    @click="showDetails = false"
                />
            </div>
        </div>

        <div v-if="showDetails" class="order-details">
            <ShSkeleton v-if="loader.isLoading.value" class="skeleton" />

            <template v-else>
                <div
                    v-for="position in positions"
                    :key="position.id"
                    class="order-details__position"
                >
                    <div class="order-details__position-header">
                        <div class="order-details__position-article">
                            Артикул #{{ position.product.article }}
                        </div>
                        <div class="order-details__position-count">
                            {{ position.count }} шт.
                        </div>
                    </div>
                    <div class="order-details__position-info">
                        <div class="order-details__position-color">
                            Цвет: {{ position.color }}
                        </div>
                        <div v-if="position.size" class="order-details__position-size">
                            Размер: {{ position.size }}
                        </div>
                    </div>
                    <div class="order-details__position-price">
                        {{ formatPrice(position.price) }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import type { Order } from '@/common/types';
import { usePositionsList } from '@/composables/usePositionsList';
import { ShButton, ShSkeleton } from '@/components/UI';

const { order } = defineProps<{
    order: Order;
}>();

const { loader, positions, fetchPositionsList } = usePositionsList();

const showDetails = ref(false);

watch(showDetails, async (value) => {
    if (value) await fetchPositionsList(order.positions);
});

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
.order {
    background-color: var(--tg-theme-bg-color, var(--color-white));
    border: 1px solid var(--tg-theme-hint-color, var(--color-grey2));
    border-radius: var(--border-radius);
    padding: 16px;
    transition: box-shadow 0.2s ease;

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
        color: var(--tg-theme-hint-color, var(--color-grey3));
    }

    &__price {
        font-size: 16px;
        font-weight: 600;
        color: var(--tg-theme-text-color, var(--color-black));
    }

    &__positions {
        .positions-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .positions-count {
            cursor: pointer;
            font-size: 14px;
            color: var(--tg-theme-button-color, var(--color-orange-dark));
        }

        .positions-hide-btn {
            cursor: pointer;
            font-size: 12px;
            color: var(--tg-theme-hint-color, var(--color-grey3));

            &:hover {
                color: var(--tg-theme-text-color, var(--color-black));
            }
        }
    }
}

.order-details {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--tg-theme-hint-color, var(--color-grey2));

    &__position {
        padding: 12px 0;
        border-bottom: 1px solid var(--tg-theme-hint-color, var(--color-grey2));

        &:last-child {
            padding-bottom: 0;
            border-bottom: none;
        }

        &:first-child {
            padding-top: 0;
        }
    }

    &__position-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    &__position-article {
        font-size: 14px;
        font-weight: 600;
        color: var(--tg-theme-text-color, var(--color-black));
    }

    &__position-count {
        font-size: 14px;
        font-weight: 500;
        color: var(--tg-theme-button-color, var(--color-orange-dark));
    }

    &__position-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
    }

    &__position-color,
    &__position-size {
        font-size: 13px;
        color: var(--tg-theme-hint-color, var(--color-grey3));
    }

    &__position-price {
        font-size: 15px;
        font-weight: 600;
        color: var(--tg-theme-text-color, var(--color-black));
        text-align: right;
    }
}

.skeleton {
    width: 100%;
    height: 100px;
    border-radius: var(--border-radius-m);
}
</style>
