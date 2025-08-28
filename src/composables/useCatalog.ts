import { ref, watch } from 'vue';

import { PRODUCT_MAP } from '@/common/model';
import { useDebounce } from '@/composables/useDebounce';
import { useLoading } from '@/composables/useLoading';
import { useProduct } from '@/composables/useProduct';
import { productApi } from '@/composables/useAirtable';
import type { Product, AirPagination, AirRecord } from '@/common/types';
import { useGlobalNotification } from '@/composables/useNotification';

export function useCatalog() {
    const loader = useLoading();
    const notification = useGlobalNotification();
    const { parseAirProductToProduct, populateFields } = useProduct();

    const searchQuery = ref('');
    const products = ref<Product[]>([]);
    const pagination = ref<AirPagination>({
        offset: undefined,
        page: 1,
        limit: 10
    });

    const handleSearch = useDebounce(async () => {
        reset();
        await fetchProductsCatalog();
    }, 300);

    watch(searchQuery, handleSearch);

    function reset() {
        products.value = [];
        pagination.value.page = 1;
        pagination.value.offset = undefined;
    }

    async function fetchMore() {
        if (!pagination.value.offset) return;

        pagination.value.page += 1;

        await fetchProductsCatalog();
    }

    async function fetchProductsCatalog() {
        try {
            loader.start();

            const filterByFormula = searchQuery.value.length
                ? `{${PRODUCT_MAP.article}}="${searchQuery.value}"`
                : undefined;

            const res = await productApi.get('/', {
                params: {
                    fields: Object.values(PRODUCT_MAP),
                    offset: pagination.value.offset,
                    pageSize: pagination.value.limit,
                    filterByFormula
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
            console.error(error);
            notification.error('Не удалось получить продукты');
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        products,
        fetchMore,
        pagination,
        searchQuery,
        fetchProductsCatalog
    };
}
