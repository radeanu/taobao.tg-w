import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useProduct } from './useProduct';
import { useLoading } from '@/composables/useLoading';
import { useQuerySync } from '@/composables/useQuerySync';
import { productApi } from '@/composables/useAirtable';
import type { Product, AirRecord, AirImage } from '@/common/types';
import { useCartStore } from './useCartStorage';
import { useGlobalNotification } from './useNotification';

export function useProductPage() {
    const route = useRoute();
    const loader = useLoading();
    const cartStore = useCartStore();
    const notification = useGlobalNotification();
    const { parseAirProductToProduct, populateFields } = useProduct();

    const product = ref<Product | null>(null);

    const { queryVal: selectedSize } = useQuerySync<string | null>('size');
    const { queryVal: selectedColor } = useQuerySync<string | null>('color');

    const isInCart = computed(() => {
        if (!product.value?.id) return false;
        const pId = product.value.id;

        return cartStore.cart.some((p) => {
            return (
                p.productId === pId &&
                p.sizeId === selectedSize.value &&
                p.colorId === selectedColor.value
            );
        });
    });

    const images = computed(() => {
        return [product.value?.image, ...(product.value?.images ?? [])].filter(
            Boolean
        ) as AirImage[];
    });

    watch(
        () => route.params.id,
        async (newId) => {
            if (!newId) return;
            await fetchProductById(newId as string);

            selectDefaultFilters();
        },
        { immediate: true }
    );

    function addToCart() {
        if (!product.value || !selectedColor.value) return;
        if (product.value.sizes.length && !selectedSize.value) return;

        return cartStore.addToCart(
            product.value.id,
            selectedSize.value,
            selectedColor.value
        );
    }

    function selectDefaultFilters() {
        if (!selectedSize.value) {
            selectedSize.value = product.value?.sizes[0]?.id ?? null;
        }

        if (!selectedColor.value) {
            selectedColor.value = product.value?.colors[0]?.id ?? null;
        }
    }

    async function fetchProductById(id: string) {
        try {
            loader.start();
            const res = await productApi.get(`/${id}`);
            const record = res.data as AirRecord;
            await populateFields([record]);

            product.value = parseAirProductToProduct(record);
        } catch (error) {
            console.error(error);
            notification.error('Не удалось получить товар');
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        images,
        product,
        isInCart,
        selectedSize,
        selectedColor,
        addToCart
    };
}
