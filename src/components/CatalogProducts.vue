<template>
    <div>
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
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { ShButton } from '@/components/UI';

import { useCatalog } from '@/composables/useCatalog';
import ProductCard from '@/components/ProductCard.vue';

const { loader, products, fetchMore, pagination, fetchProductsCatalog } = useCatalog();

onMounted(async () => {
    await fetchProductsCatalog();
});
</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
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
