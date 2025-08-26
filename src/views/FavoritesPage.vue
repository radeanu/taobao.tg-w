<template>
    <div class="favorites-view">
        <header class="page-header">
            <h1 class="page-title">Избранное</h1>
        </header>

        <div class="favorites-content">
            <ShSkeleton v-if="favoritesStore.loading.isLoading" class="skeleton" />

            <div v-else>
                <div v-if="favoritesStore.favorites.length" class="products-grid">
                    <ProductCard
                        v-for="product in favoriteProducts"
                        :key="product.id"
                        :product="product"
                    />
                </div>

                <div v-else class="empty-state">
                    <ShIcon name="heart" class="empty-icon" />

                    <h2 class="empty-title">Нет избранных товаров</h2>

                    <p class="empty-description">
                        Добавляйте товары в избранное, чтобы видеть их здесь
                    </p>

                    <RouterLink to="/" class="browse-button">
                        Перейти к товарам
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

import { ShIcon, ShSkeleton } from '@/components/UI';
import { useCatalog } from '@/composables/useCatalog';
import ProductCard from '@/components/ProductCard.vue';
import { useFavoritesStore } from '@/composables/useFavorites';

const favoritesStore = useFavoritesStore();
const { products, fetchProductsCatalog } = useCatalog();

const favoriteProducts = computed(() => {
    return products.value.filter((product) =>
        favoritesStore.favorites.includes(product.id)
    );
});

onMounted(async () => {
    await Promise.all([favoritesStore.fetchFavorites(), fetchProductsCatalog()]);
});
</script>

<style lang="scss" scoped>
.skeleton {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius-m);
}

.favorites-view {
    min-height: 100vh;
    padding-bottom: 80px;
}

.page-header {
    padding: var(--layout-pad-y) var(--layout-pad-x);
    border-bottom: 1px solid var(--tg-theme-hint-color, var(--color-grey2));
    background-color: var(--tg-theme-bg-color, var(--color-white));
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--tg-theme-text-color, var(--color-black));
    margin: 0;
}

.favorites-content {
    padding: var(--layout-pad-y) var(--layout-pad-x);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    width: 64px;
    height: 64px;
    color: var(--tg-theme-hint-color, var(--color-grey1));
    margin-bottom: 24px;
}

.empty-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--tg-theme-text-color, var(--color-black));
    margin: 0 0 12px 0;
}

.empty-description {
    font-size: 16px;
    color: var(--tg-theme-hint-color, var(--color-grey1));
    margin: 0 0 32px 0;
    line-height: 1.5;
}

.browse-button {
    display: inline-block;
    padding: 12px 24px;
    background-color: var(--tg-theme-button-color, var(--color-red));
    color: var(--tg-theme-button-text-color, var(--color-white));
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: 500;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
}

.products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
}
</style>
