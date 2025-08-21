import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useProduct } from './useProduct';
import { useLoading } from '@/composables/useLoading';
import { productApi } from '@/composables/useAirtable';
import type { Product, AirRecord } from '@/common/types';

export function useProductPage() {
    const route = useRoute();
    const loader = useLoading();
    const { parseAirProductToProduct, populateFields } = useProduct();

    const product = ref<Product | null>(null);
    const selectedSize = ref<string | null>(null);

    watch(
        () => route.params.id,
        async (newId) => {
            if (newId) {
                await fetchProductById(newId as string);
            }
        },
        { immediate: true }
    );

    watch(product, (newProduct) => {
        if (newProduct) {
            selectedSize.value = newProduct.sizes?.[0]?.id || null;
        }
    });

    async function fetchProductById(id: string) {
        try {
            loader.start();
            const res = await productApi.get(`/${id}`);
            const record = res.data as AirRecord;
            await populateFields([record]);

            product.value = parseAirProductToProduct(record);
        } catch (error) {
            console.log(error);
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        product,
        selectedSize
    };
}
