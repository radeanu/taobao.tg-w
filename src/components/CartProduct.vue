<template>
    <div class="cart-product">
        <RouterLink
            :to="{ name: 'product', params: { id: product.id } }"
            class="cart-product__image"
        >
            <ShImage :src="product.cart.color?.image?.thumbnails?.large?.url" />
        </RouterLink>

        <div class="cart-product__body">
            <div class="cart-product__title">Артикул: {{ product.article }}</div>
            <div class="cart-product__price">{{ product.priceRub }} ₽</div>
            <div v-if="product.cart.color?.name" class="cart-product__color">
                Цвет: {{ product.cart.color.name }}
            </div>
            <div v-if="product.cart.size?.name" class="cart-product__size">
                Размер: {{ product.cart.size.name }}
            </div>

            <div class="cart-product__controls">
                <ShButton
                    kind="secondary"
                    @click="updateCount(product.cart.count - 1)"
                    label="-"
                />

                <div>
                    <span v-if="loader.isLoading.value" class="cart-product__count"
                        >...</span
                    >
                    <input
                        v-else
                        class="cart-product__count"
                        type="number"
                        :value="product.cart.count"
                        min="1"
                    />
                </div>

                <ShButton
                    kind="secondary"
                    @click="updateCount(product.cart.count + 1)"
                    label="+"
                />

                <ShButton
                    kind="unstyled"
                    class="cart-product__remove"
                    @click="updateCount(0)"
                    label="Удалить"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ShButton, ShImage } from '@UI';
import type { CartProduct } from '@/common/types';
import { useLoading } from '@/composables/useLoading';
import { useCartStore } from '@/composables/useCartStorage';
import { useGlobalNotification } from '@/composables/useNotification';

const product = defineModel<CartProduct>({ required: true });
const $emit = defineEmits<{
    (e: 'remove'): void;
}>();

const cartStore = useCartStore();
const loader = useLoading();
const notification = useGlobalNotification();

async function updateCount(count: number) {
    try {
        loader.start();
        await cartStore.setCount(product.value.cart.id, count);

        if (count === 0) return $emit('remove');

        product.value.cart.count = count;
    } catch (error) {
        console.error(error);
        notification.error('Не удалось обновить количество');
    } finally {
        loader.end();
    }
}
</script>

<style scoped lang="scss">
.cart-product {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 12px;
    align-items: center;
    padding: 8px;
    border-radius: var(--border-radius);
    background: var(--tg-theme-bg-color, var(--color-white));
}

.cart-product__image {
    width: 90px;
    height: 90px;
    border-radius: var(--border-radius);
    overflow: hidden;
    cursor: pointer;
    transition: opacity 0.2s;
    text-decoration: none;

    &:hover {
        opacity: 0.8;
    }
}

.cart-product__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.cart-product__title {
    font-weight: 600;
}

.cart-product__price {
    color: var(--tg-theme-section-header-text-color, var(--color-black));
}

.cart-product__color {
    font-size: 14px;
    color: var(--tg-theme-hint-color, var(--color-gray-600));
    font-weight: 500;
}

.cart-product__size {
    font-size: 14px;
    color: var(--tg-theme-hint-color, var(--color-gray-600));
    font-weight: 500;
}

.cart-product__controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.cart-product__count {
    width: 36px;
    height: 36px;
    text-align: center;
    border-radius: var(--border-radius-s);
}

/* Hide default number input spinners (Chrome, Safari, Edge) */
.cart-product__count::-webkit-outer-spin-button,
.cart-product__count::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

/* Hide default number input spinners (Firefox) */
.cart-product__count {
    -moz-appearance: textfield;
    appearance: textfield;
}

.cart-product__remove {
    margin-left: auto;
    color: var(--color-red);
}
</style>
