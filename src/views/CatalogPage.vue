<template>
    <main>
        <div v-if="loader.isLoading.value && products.length === 0" class="loading">
            Загрузка...
        </div>

        <div class="products">
            <ProductCard v-for="item in products" :key="item.id" :product="item" />

            <template v-if="loader.isLoading.value && products.length > 0">
                <div v-for="i in 2" :key="`skeleton-${i}`" class="product-skeleton">
                    <ShSkeleton />
                </div>
            </template>
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
    </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { ShButton, ShSkeleton } from '@UI';
import { useCatalog } from '@/composables/useCatalog';
import ProductCard from '@/components/ProductCard.vue';

const { loader, products, fetchMore, pagination, fetchProductsCatalog } = useCatalog();

onMounted(async () => {
    await fetchProductsCatalog();
});
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
    padding-bottom: 100px;
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

.product-skeleton {
    width: 100%;
    height: 300px;
    border-radius: var(--border-radius-m);
}
</style>
