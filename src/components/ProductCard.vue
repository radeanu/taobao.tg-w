<template>
    <div class="product">
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">
            <ShImage :src="product.image?.thumbnails?.large?.url" class="image" lazy />
        </RouterLink>

        <p class="price">{{ product.priceRub }} ₽</p>

        <ShButton
            v-if="isInCart"
            label="Убрать"
            kind="telegram"
            full-width
            class="btn-buy"
            @click="cartStore.removeFromCart(product.id)"
        />

        <ShButton
            v-else
            label="Купить"
            kind="secondary"
            full-width
            class="btn-buy"
            @click="cartStore.addToCart(product.id)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Product } from '@/common/types';
import { ShImage, ShButton } from '@/components/UI';
import { useCartStore } from '@/composables/useCartStorage';

const props = defineProps<{
    product: Product;
}>();

const cartStore = useCartStore();

const isInCart = computed(() => {
    return cartStore.cart.some((p) => p.id === props.product.id);
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
