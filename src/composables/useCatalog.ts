import { ref } from 'vue';

import { PRODUCT_MAP } from '@/common/model';
import { useLoading } from '@/composables/useLoading';
import { useProduct } from '@/composables/useProduct';
import { productApi } from '@/composables/useAirtable';
import type { Product, AirPagination, AirRecord } from '@/common/types';

export function useCatalog() {
    const loader = useLoading();
    const { parseAirProductToProduct, populateFields } = useProduct();

    const products = ref<Product[]>([]);
    const pagination = ref<AirPagination>({
        offset: undefined,
        page: 1,
        limit: 10
    });

    async function fetchMore() {
        if (!pagination.value.offset) return;

        pagination.value.page += 1;

        await fetchProductsCatalog();
    }

    async function fetchProductsCatalog() {
        try {
            loader.start();
            const res = await productApi.get('/', {
                params: {
                    fields: Object.values(PRODUCT_MAP),
                    offset: pagination.value.offset,
                    pageSize: pagination.value.limit
                }
            });

            const records = res.data.records ?? [];

            await populateFields(records);

            pagination.value.offset = res.data?.offset;
            const list = records.map((record: AirRecord) => {
                return parseAirProductToProduct(record);
            });

            products.value.push(...list);
        } catch (error) {
            console.log(error);
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        products,
        fetchMore,
        pagination,
        fetchProductsCatalog
    };
}
