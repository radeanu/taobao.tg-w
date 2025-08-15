<template>
    <main>
        <div v-if="loader.isLoading.value">Loading...</div>

        <ul v-else class="products">
            <li v-for="item in products" class="product">
                <ShImage :src="item.image?.thumbnails?.large?.url" class="image" lazy />

                <p class="price">{{ item.priceRub }} ₽</p>

                <ShButton label="Купить" kind="secondary" full-width class="btn-buy" />
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { ShImage, ShButton } from '@/components/UI';

import { useCatalog } from '@/composables/useCatalog';

const { loader, products, fetchProductsCatalog } = useCatalog();

onMounted(async () => {
    await fetchProductsCatalog();
});
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
}

.products {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    row-gap: 30px;
    column-gap: 10px;
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
