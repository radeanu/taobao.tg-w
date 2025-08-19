<template>
    <main>
        <div v-if="loader.isLoading.value" class="loading">Загрузка...</div>

        <div class="products">
            <ProductCard v-for="item in products" :key="item.id" :product="item" />
        </div>

        <ShButton
            v-if="pagination.offset"
            label="Загрузить еще"
            kind="telegram"
            full-width
            :class="{
                'btn-more': true,
                'btn-hidden': loader.isLoading.value
            }"
            @click="fetchMore"
        />

        <pre>{{ cartStore.cart.length }}</pre>

        <ShButton v-if="showCartButton" class="btn-cart" kind="telegram">
            {{ cartStore.cart.length }}
        </ShButton>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { ShButton } from '@UI';
import { useCatalog } from '@/composables/useCatalog';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/composables/useCartStorage';

const cartStore = useCartStore();
const { loader, products, fetchMore, pagination, fetchProductsCatalog } = useCatalog();

const showCartButton = computed(() => {
    return (
        !loader.isLoading.value && cartStore.cart.length > 0 && products.value.length > 0
    );
});

onMounted(async () => {
    await fetchProductsCatalog();
});
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

.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    padding: 10px 20px;
    text-align: center;
    color: var(--tg-theme-text-color);
    background-color: var(--tg-theme-bg-color, var(--color-white));
}

.products {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    row-gap: 30px;
    column-gap: 10px;
}

.btn-more {
    margin-top: 20px;

    &.btn-hidden {
        visibility: hidden;
    }
}
</style>
