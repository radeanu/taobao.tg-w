<template>
    <div class="product">
        <div class="image-container">
            <RouterLink :to="{ name: 'product', params: { id: product.id } }">
                <ShImage
                    :src="product.image?.thumbnails?.large?.url"
                    class="image"
                    lazy
                />
            </RouterLink>

            <button
                class="favorite-btn"
                :class="{ 'is-favorite': isFavorite }"
                @click="toggleFavorite"
                type="button"
            >
                <ShIcon name="heart" />
            </button>
        </div>

        <div class="price-row">
            <p class="price">{{ product.priceRub }} ₽</p>
            <p class="article">#{{ product.article }}</p>
        </div>

        <ShButton
            :label="isInCart ? 'В корзине' : 'Купить'"
            :kind="isInCart ? 'telegram' : 'secondary'"
            full-width
            :disabled="isInCart"
            class="btn-buy"
            @click="showModal = !isInCart"
        />

        <ProductSelectionModal
            v-if="showModal"
            :id="product.id"
            @close="showModal = false"
            @added="handleAdded"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import type { Product } from '@/common/types';
import { ShImage, ShButton, ShIcon } from '@/components/UI';
import { useCartStore } from '@/composables/useCartStorage';
import { useFavoritesStore } from '@/stores/favorites.store';
import ProductSelectionModal from '@/components/ProductSelectionModal.vue';

const props = defineProps<{
    product: Product;
}>();

const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const showModal = ref(false);

const isInCart = computed(() => {
    return cartStore.cart.some((p) => p.productId === props.product.id);
});

const isFavorite = computed(() => {
    return favoritesStore.isFavorite(props.product.id);
});

async function handleAdded() {
    await cartStore.fetchCart();
    showModal.value = false;
}

async function toggleFavorite() {
    await favoritesStore.toggleFavorite(props.product.id);
}
</script>

<style lang="scss" scoped>
.product {
    .image-container {
        position: relative;
    }

    .image {
        width: 100%;
        height: 220px;
        border-radius: var(--border-radius-m);
    }

    .favorite-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: var(--z-index);

        &:hover {
            background: rgba(255, 255, 255, 1);
            transform: scale(1.1);
        }

        .sh-icon {
            width: 18px;
            height: 18px;
            color: var(--color-grey1);
            transition: color 0.2s ease;
        }

        &.is-favorite {
            background: var(--color-red);

            .sh-icon {
                color: white;
            }

            &:hover {
                background: var(--color-red-dark);
            }
        }
    }

    .price-row {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .price {
        font-weight: bold;
        color: var(--color-red);
    }

    .article {
        font-size: 14px;
        color: var(--color-grey);
    }

    .btn-buy {
        margin-top: 10px;
    }
}
</style>
