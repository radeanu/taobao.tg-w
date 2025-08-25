<template>
    <div class="product">
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">
            <ShImage :src="product.image?.thumbnails?.large?.url" class="image" lazy />
        </RouterLink>

        <p class="price">{{ product.priceRub }} ₽</p>

        <ShButton
            :label="isInCart ? 'В корзине' : 'Купить'"
            :kind="isInCart ? 'telegram' : 'secondary'"
            full-width
            :disabled="isInCart"
            class="btn-buy"
            @click="showModal = !isInCart"
        />

        <ProductSelectionModal
            v-if="showModal"
            :id="product.id"
            @close="showModal = false"
            @added="handleAdded"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import type { Product } from '@/common/types';
import { ShImage, ShButton } from '@/components/UI';
import { useCartStore } from '@/composables/useCartStorage';
import ProductSelectionModal from '@/components/ProductSelectionModal.vue';

const props = defineProps<{
    product: Product;
}>();

const cartStore = useCartStore();
const showModal = ref(false);

const isInCart = computed(() => {
    return cartStore.cart.some((p) => p.productId === props.product.id);
});

async function handleAdded() {
    await cartStore.fetchCart();
    showModal.value = false;
}
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
