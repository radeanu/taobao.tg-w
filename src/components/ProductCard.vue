<template>
    <div class="product">
        <ShImage :src="product.image?.thumbnails?.large?.url" class="image" lazy />

        <p class="price">{{ product.priceRub }} ₽</p>

        <ShButton
            v-if="isInCart"
            label="В корзине"
            kind="telegram"
            full-width
            class="btn-buy"
        />

        <ShButton
            v-else
            label="Купить"
            kind="secondary"
            full-width
            class="btn-buy"
            @click="addToCart(product.id)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Product } from '@/common/types';
import { ShImage, ShButton } from '@/components/UI';
import { cartStore } from '@/composables/useCartStorage';

const props = defineProps<{
    product: Product;
}>();

const { cart, addToCart } = cartStore();

const isInCart = computed(() => {
    return cart.some((p) => p.id === props.product.id);
});
</script>

<style lang="scss" scoped>
.product {
    .image {
        width: 100%;
        height: 220px;
        border-radius: var(--border-radius-m);
    }

    .price {
        margin-top: 10px;
        font-weight: bold;
        color: var(--color-red);
    }

    .btn-buy {
        margin-top: 10px;
    }
}
</style>
