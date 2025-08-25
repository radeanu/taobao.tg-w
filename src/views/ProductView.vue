<template>
    <main>
        <ShSkeleton v-if="loader.isLoading.value" class="skeleton" />

        <div v-else-if="product" class="product">
            <div class="slideshow-container">
                <ShImageSlideshow :images="images" />
            </div>

            <div class="product-details">
                <h1 class="article">{{ product.article }}</h1>
                <p>{{ PRODUCT_MAP.priceRub }}: {{ product.priceRub }}</p>
                <p>{{ PRODUCT_MAP.priceCny }}: {{ product.priceCny }}</p>
                <p>{{ PRODUCT_MAP.weight }}: {{ product.weight }}</p>
                <p>
                    {{ PRODUCT_MAP.link }}:
                    <a :href="product.link" target="_blank">{{ product.link }}</a>
                </p>
            </div>

            <div v-if="product.sizes?.length" class="chip-container">
                <h2>{{ PRODUCT_MAP.sizes }}</h2>

                <div class="chip-list">
                    <ShChip
                        v-for="size in product.sizes"
                        :key="size.id"
                        :active="selectedSize === size.id"
                        @click="selectedSize = size.id"
                    >
                        <span>{{ size.name }}</span>
                    </ShChip>
                </div>
            </div>

            <div v-if="product.colors?.length" class="slideshow-container">
                <h2>{{ PRODUCT_MAP.colors }}</h2>

                <ShHorizontalCarousel :items="product.colors">
                    <template #default="{ item }">
                        <div
                            class="color-item"
                            :class="{ 'color-item--selected': selectedColor === item.id }"
                            @click="selectedColor = item.id"
                        >
                            <ShImage
                                lazy
                                class="color-image"
                                :src="item.image?.thumbnails?.large?.url"
                            />
                            <span>{{ item.name }}</span>
                        </div>
                    </template>
                </ShHorizontalCarousel>
            </div>

            <div class="product-actions">
                <ShButton
                    kind="telegram"
                    :label="isInCart ? 'В корзине' : 'Купить'"
                    :disabled="isInCart"
                    @click="addToCart"
                />
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { PRODUCT_MAP } from '@/common/model';
import { useProductPage } from '@/composables/useProductPage';
import {
    ShImage,
    ShChip,
    ShButton,
    ShSkeleton,
    ShHorizontalCarousel,
    ShImageSlideshow
} from '@/components/UI';

const { product, loader, selectedSize, selectedColor, isInCart, images, addToCart } =
    useProductPage();
</script>

<style lang="scss" scoped>
main {
    padding: 20px 8px;
    padding-bottom: 100px;
}

.product {
    max-width: 800px;
    margin: 0 auto;
}

.skeleton {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius-m);
}

.main-product-image {
    width: 100%;
    max-height: 400px;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
}

.product-details {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.article {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.slideshow-container {
    margin-bottom: 20px;
}

.chip-container {
    margin-bottom: 20px;
}

.chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.color-item,
.size-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.color-item--selected {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-image {
    width: 100px;
    height: 100px;
    margin-bottom: 5px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
}

.color-item--selected .color-image {
    border-color: var(--tg-theme-button-color, #007aff);
}

.product-actions {
    position: sticky;
    bottom: 0;
    padding: 20px;
    background-color: var(--tg-bg-color);
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 0 -20px -20px;
    border-top: 1px solid var(--tg-secondary-bg-color);

    :deep(.sh-button) {
        flex-grow: 1;
    }
}

.cart-fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
}
</style>
