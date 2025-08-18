<template>
    <main>
        <CatalogProducts />

        <ShButton class="btn-cart" kind="telegram">{{ cart.length }} </ShButton>
    </main>
</template>

<script setup lang="ts">
import { ShButton } from '@UI';
import { cartStore } from '@/composables/useCartStorage';
import CatalogProducts from '@/components/CatalogProducts.vue';

const { cart } = cartStore();
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
}

.btn-cart {
    position: sticky;
    bottom: 20px;
    right: 0;
    margin-left: auto;
}
</style>
