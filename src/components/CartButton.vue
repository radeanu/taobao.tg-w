<template>
    <ShButton
        v-if="showCartButton"
        class="btn-cart"
        kind="secondary"
        icon-left="cart"
        @click="goToCart"
    >
        <ShBadge absolute :value="cartStore.cart.length" kind="error" />
    </ShButton>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ShBadge, ShButton } from '@/components/UI';
import { useCartStore } from '@/composables/useCartStorage';

const router = useRouter();

const cartStore = useCartStore();
const showCartButton = computed(() => cartStore.cart.length > 0);

function goToCart() {
    router.push('/cart');
}
</script>

<style lang="scss" scoped>
.btn-cart {
    position: sticky;
    bottom: 20px;
    right: 0;
    margin-left: auto;
    z-index: 10;
    overflow: unset;
}
</style>
