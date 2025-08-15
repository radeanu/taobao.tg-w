import { ref } from 'vue';

import { useAirtable } from '@/composables/useAirtable';
import { useLoading } from '@/composables/useLoading';
import type { Product, AirProduct } from '@/common/types';
import { COLOR_MAP, PRODUCT_MAP, SIZE_MAP } from '@/common/model';

export function useCatalog() {
    const repo = useAirtable();
    const loader = useLoading();

    const products = ref<Product[]>([]);
    const colors: { [key: string]: string } = {};
    const sizes: { [key: string]: string } = {};

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

                const batchRecords = await repo.colorTable
                    .select({
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    })
                    .all();

                batchRecords.forEach((r) => {
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
                    .filter(([_, s]) => s.length)
                    .map(([id]) => id)
                    .slice(i, i + 100);

                const batchRecords = await repo.sizeTable
                    .select({
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    })
                    .all();

                batchRecords.forEach((r) => {
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
            const res = await repo.productTable
                .select({
                    maxRecords: 30,
                    fields: Object.values(PRODUCT_MAP)
                })
                .all();

            res.forEach((record) => {
                const colorsL = (record.fields[PRODUCT_MAP.colors] ?? []) as string[];
                const sizesL = (record.fields[PRODUCT_MAP.sizes] ?? []) as string[];

                colorsL.forEach((v) => (colors[v] = ''));
                sizesL.forEach((v) => (sizes[v] = ''));
            });

            await _fetchColors();
            await _fetchSizes();

            products.value = res.map((record) => {
                const payload = {
                    article: record.get(PRODUCT_MAP.article),
                    weight: record.get(PRODUCT_MAP.weight),
                    link: record.get(PRODUCT_MAP.link),
                    priceRub: record.get(PRODUCT_MAP.priceRub),
                    priceCny: record.get(PRODUCT_MAP.priceCny),
                    image: record.get(PRODUCT_MAP.image) ?? [],
                    colorsPhoto: record.get(PRODUCT_MAP.colorsPhoto) ?? [],
                    colors: record.get(PRODUCT_MAP.colors) ?? [],
                    sizes: record.get(PRODUCT_MAP.sizes) ?? []
                } as AirProduct;

                return formatProduct(payload);
            });
        } catch (error) {
            console.log(error);
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        products,
        fetchProductsCatalog
    };
}
