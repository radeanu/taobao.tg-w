import { ref } from 'vue';

import type { AirRecord, Product } from '@/common/types';
import { productApi } from '@/composables/useAirtable';
import { useLoading } from '@/composables/useLoading';
import { useProduct } from '@/composables/useProduct';

export function useProducts() {
    const products = ref<Product[]>([]);

    const loading = useLoading();
    const { parseAirProductToProduct, populateFields } = useProduct();

    async function fetchProducts(ids: string[]) {
        const uniqueIds = [...new Set(ids)];
        if (!uniqueIds.length) return;

        try {
            loading.start();
            for (let i = 0; i < uniqueIds.length; i += 100) {
                const batch = uniqueIds.slice(i, i + 100);
                if (!batch.length) return;

                const res = await productApi.get('/', {
                    params: {
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    }
                });

                const records = (res.data?.records ?? []) as AirRecord[];
                await populateFields(records);

                const parsed = records.map((r) => parseAirProductToProduct(r));
                products.value = parsed;
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.end();
        }
    }

    return {
        loading,
        products,
        fetchProducts
    };
}
