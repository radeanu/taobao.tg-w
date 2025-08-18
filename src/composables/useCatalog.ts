import { ref } from 'vue';

import { useLoading } from '@/composables/useLoading';
import { COLOR_MAP, PRODUCT_MAP, SIZE_MAP } from '@/common/model';
import { productApi, colorApi, sizeApi } from '@/composables/useAirtable';
import type { Product, AirProduct, AirPagination, AirRecord } from '@/common/types';

export function useCatalog() {
    const loader = useLoading();

    const products = ref<Product[]>([]);
    const colors: { [key: string]: string } = {};
    const sizes: { [key: string]: string } = {};
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

    function formatProduct(product: AirProduct): Product {
        const colorsL = product.colors.map((cId, idx) => {
            return {
                id: cId,
                name: colors[cId as keyof typeof colors] ?? '-',
                image: product.colorsPhoto?.[idx] ?? null
            };
        });

        const sizesL = product.sizes.map((sId) => {
            return {
                id: sId,
                name: sizes[sId as keyof typeof sizes] ?? '-'
            };
        });

        return {
            id: product.id,
            article: product.article,
            link: product.link,
            priceCny: product.priceCny,
            priceRub: product.priceRub,
            weight: product.weight,
            sizes: sizesL,
            colors: colorsL,
            image: product.image?.[0] ?? null
        };
    }

    async function _fetchColors() {
        try {
            for (let i = 0; i < Object.keys(colors).length; i += 100) {
                const batch = Object.entries(colors)
                    .filter(([_, color]) => !color.length)
                    .map(([id]) => id)
                    .slice(i, i + 100);

                if (!batch.length) return;

                const res = await colorApi.get('/', {
                    params: {
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    }
                });

                const records = res.data?.records ?? [];

                records.forEach((r: AirRecord) => {
                    colors[r.id] = r.fields[COLOR_MAP.name] as string;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function _fetchSizes() {
        try {
            for (let i = 0; i < Object.keys(sizes).length; i += 100) {
                const batch = Object.entries(sizes)
                    .filter(([_, size]) => !size.length)
                    .map(([id]) => id)
                    .slice(i, i + 100);

                if (!batch.length) return;

                const res = await sizeApi.get('/', {
                    params: {
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    }
                });

                const records = res.data?.records ?? [];

                records.forEach((r: AirRecord) => {
                    sizes[r.id] = r.fields[SIZE_MAP.name] as string;
                });
            }
        } catch (error) {
            console.log(error);
        }
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

            records.forEach((item: AirRecord) => {
                const colorsL = (item.fields[PRODUCT_MAP.colors] ?? []) as string[];
                const sizesL = (item.fields[PRODUCT_MAP.sizes] ?? []) as string[];

                colorsL.forEach((v) => (colors[v] = ''));
                sizesL.forEach((v) => (sizes[v] = ''));
            });

            await _fetchColors();
            await _fetchSizes();

            pagination.value.offset = res.data?.offset;
            const list = records.map((record: AirRecord) => {
                const payload = {
                    id: record.id,
                    article: record.fields?.[PRODUCT_MAP.article],
                    weight: record.fields?.[PRODUCT_MAP.weight],
                    link: record.fields?.[PRODUCT_MAP.link],
                    priceRub: record.fields?.[PRODUCT_MAP.priceRub],
                    priceCny: record.fields?.[PRODUCT_MAP.priceCny],
                    image: record.fields?.[PRODUCT_MAP.image] ?? [],
                    colorsPhoto: record.fields?.[PRODUCT_MAP.colorsPhoto] ?? [],
                    colors: record.fields?.[PRODUCT_MAP.colors] ?? [],
                    sizes: record.fields?.[PRODUCT_MAP.sizes] ?? []
                } as AirProduct;

                return formatProduct(payload);
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
