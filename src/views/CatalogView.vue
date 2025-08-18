<template>
    <main>
        <div v-if="loader.isLoading.value" class="loading">Загрузка...</div>

        <div v-if="products.length">
            <ul class="products">
                <li v-for="item in products" class="product">
                    <ShImage
                        :src="item.image?.thumbnails?.large?.url"
                        class="image"
                        lazy
                    />

                    <p class="price">{{ item.priceRub }} ₽</p>

                    <ShButton
                        label="Купить"
                        kind="secondary"
                        full-width
                        class="btn-buy"
                    />
                </li>
            </ul>

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
import { onMounted } from 'vue';

import { ShImage, ShButton } from '@/components/UI';

import { useCatalog } from '@/composables/useCatalog';

const app = window.Telegram.WebApp;

console.log(app.CloudStorage);
const { loader, products, fetchMore, pagination, fetchProductsCatalog } = useCatalog();

onMounted(async () => {
    await fetchProductsCatalog();
});
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
}

.loading {
    position: sticky;
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
        border-radius: 16px;
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
