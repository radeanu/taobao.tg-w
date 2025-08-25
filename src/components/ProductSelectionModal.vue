<template>
    <ShModal close-btn @close="$emit('close')">
        <div v-if="loader.isLoading.value">
            <ShSkeleton class="product-loading" />
        </div>

        <div v-else-if="product" class="product-selection-modal">
            <div class="product-info">
                <ShImage
                    :src="product.image?.thumbnails?.large.url"
                    class="product-image"
                />
                <div class="product-details">
                    <h3 class="product-title">Артикул {{ product.article }}</h3>
                    <p class="product-price">{{ product.priceRub }} ₽</p>
                </div>
            </div>

            <div v-if="product.sizes.length" class="selection-section">
                <h4 class="section-title">Размер</h4>

                <div class="size-options">
                    <ShButton
                        v-for="size in product.sizes"
                        :key="size.id"
                        :label="size.name"
                        :kind="selectedSize?.id === size.id ? 'primary' : 'secondary'"
                        class="size-option"
                        @click="selectedSize = size"
                    />
                </div>
            </div>

            <div v-if="product.colors.length" class="selection-section">
                <h4 class="section-title">Цвет</h4>

                <ShHorizontalCarousel :items="product.colors" class="color-carousel">
                    <template #default="{ item: color }">
                        <div
                            class="color-option"
                            :class="{
                                'color-selected': selectedColor?.id === color.id
                            }"
                            @click="selectedColor = color"
                        >
                            <ShImage
                                v-if="color.image"
                                :src="color.image.thumbnails.small.url"
                                lazy
                                :preview="color.image.thumbnails.large.url"
                                class="color-image"
                            />

                            <span class="color-name">{{ color.name }}</span>
                        </div>
                    </template>
                </ShHorizontalCarousel>
            </div>

            <div class="modal-actions">
                <ShButton
                    label="Добавить в корзину"
                    kind="telegram"
                    full-width
                    :disabled="isDisabledSubmit"
                    @click="handleAddToCart"
                />
            </div>
        </div>
    </ShModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import type { Size, Color, AirRecord, Product } from '@/common/types';
import {
    ShModal,
    ShImage,
    ShButton,
    ShHorizontalCarousel,
    ShSkeleton
} from '@/components/UI';
import { useCartStore } from '@/composables/useCartStorage';
import { productApi } from '@/composables/useAirtable';
import { useLoading } from '@/composables/useLoading';
import { useProduct } from '@/composables/useProduct';

const props = defineProps<{
    id: string;
}>();

const $emit = defineEmits<{
    (e: 'close'): void;
    (e: 'added'): void;
}>();

const loader = useLoading();
const cartStore = useCartStore();
const { parseAirProductToProduct, populateFields } = useProduct();

const product = ref<Product | null>(null);
const selectedSize = ref<Size | null>(null);
const selectedColor = ref<Color | null>(null);

const isDisabledSubmit = computed(() => {
    if (!product.value) return true;
    if (product.value.sizes.length && !selectedSize.value) return true;
    if (!selectedColor.value?.id) return true;

    return false;
});

onMounted(async () => {
    try {
        loader.start();
        const res = await productApi.get(`/${props.id}`);
        const record = res.data as AirRecord;
        await populateFields([record]);

        product.value = parseAirProductToProduct(record);

        selectedSize.value = product.value?.sizes[0] ?? null;
    } catch (error) {
        console.log(error);
    } finally {
        loader.end();
    }
});

function handleAddToCart() {
    if (isDisabledSubmit.value) return;

    cartStore.addToCart(
        product.value?.id as string,
        selectedSize.value?.id ?? null,
        selectedColor.value?.id as string
    );

    $emit('added');
}
</script>

<style lang="scss" scoped>
.product-selection-modal {
    min-width: 300px;
    max-width: 400px;
}

.product-loading {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius-m);
}

.product-info {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--color-grey4);
}

.product-image {
    width: 80px;
    height: 80px;
    border-radius: var(--border-radius-s);
    flex-shrink: 0;
}

.product-details {
    flex: 1;
}

.product-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color);
}

.product-price {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: var(--color-red);
}

.selection-section {
    margin-bottom: 20px;
}

.section-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--tg-theme-text-color);
}

.size-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.size-option {
    min-width: 60px;
    height: 36px;
    font-size: 14px;
}

.color-carousel {
    height: 80px;
}

.color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--border-radius-s);
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--color-grey4);
    }

    &.color-selected {
        background-color: var(--color-orange);
        color: var(--tg-button-text-color);
    }
}

.color-image {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-s);
    background-size: cover;
    background-position: center;
    border: 2px solid var(--color-grey4);
}

.color-name {
    font-size: 12px;
    text-align: center;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.modal-actions {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--color-grey4);
}
</style>
