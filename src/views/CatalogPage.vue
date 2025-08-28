<template>
    <main>
        <div v-if="displaySearch" class="search-container">
            <input
                v-model.trim="searchQuery"
                type="text"
                placeholder="Поиск по артикулу"
                class="search-input"
            />
        </div>

        <ShSkeleton
            v-if="loader.isLoading.value && pagination.page === 1"
            class="skeleton"
        />

        <div v-else>
            <div v-if="!products.length" class="empty">
                <p>Ничего не найдено</p>
            </div>

            <div class="products">
                <ProductCard v-for="item in products" :key="item.id" :product="item" />

                <template v-if="loader.isLoading.value && pagination.page > 1">
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
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { ShButton, ShSkeleton } from '@UI';
import { useCatalog } from '@/composables/useCatalog';
import ProductCard from '@/components/ProductCard.vue';

const { loader, products, fetchMore, pagination, fetchProductsCatalog, searchQuery } =
    useCatalog();

const displaySearch = computed(() => {
    const isLoading = loader.isLoading.value;
    const isSearch = searchQuery.value.length;

    return isSearch || !isLoading || products.value.length;
});

onMounted(async () => {
    await fetchProductsCatalog();
});
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
    padding-bottom: 100px;
    padding-top: 0;
}

.skeleton {
    width: 100%;
    height: 200px;
    margin-top: 20px;
    border-radius: var(--border-radius-m);
}

.search-container {
    margin-bottom: 20px;
    position: sticky;
    top: 0;
    z-index: 999;
    padding: 10px 0;
    background-color: var(--tg-theme-bg-color, var(--color-white));
}

.search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-grey3);
    border-radius: var(--border-radius-m);
    font-size: 16px;
    background-color: var(--tg-theme-bg-color, var(--color-white));
    color: var(--tg-theme-text-color, var(--color-black));
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: var(--color-blue);
    }

    &::placeholder {
        color: var(--color-grey2);
    }
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

.empty {
    padding: 30px 0;
    text-align: center;
}
</style>
