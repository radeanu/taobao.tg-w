import { PRODUCT_MAP } from '@/common/model';
import type { AirProduct, Product, AirRecord } from '@/common/types';
import { useColorsStore } from '@/stores/colors.store';
import { useSizesStore } from '@/stores/sizes.store';

export function useProduct() {
    const sizesStore = useSizesStore();
    const colorsStore = useColorsStore();

    async function populateFields(products: AirRecord[]) {
        const colors: string[] = [];
        const sizes: string[] = [];

        products.forEach((item: AirRecord) => {
            const colorsL = (item.fields[PRODUCT_MAP.colors] ?? []) as string[];
            const sizesL = (item.fields[PRODUCT_MAP.sizes] ?? []) as string[];

            colors.push(...colorsL);
            sizes.push(...sizesL);
        });

        colorsStore.saveColors(colors);
        sizesStore.saveSizes(sizes);

        await Promise.allSettled([colorsStore.fetchColors(), sizesStore.fetchSizes()]);
    }

    function parseAirProductToProduct(record: AirRecord): Product {
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
            sizes: record.fields?.[PRODUCT_MAP.sizes] ?? [],
            images: record.fields?.[PRODUCT_MAP.images] ?? []
        } as AirProduct;

        return formatProduct(payload);
    }

    function formatProduct(product: AirProduct): Product {
        const colorsL = product.colors.map((cId, idx) => {
            return {
                id: cId,
                name: colorsStore.colors[cId] ?? '-',
                image: product.colorsPhoto[idx] ?? null
            };
        });

        const sizesL = product.sizes.map((sId) => {
            return {
                id: sId,
                name: sizesStore.sizes[sId] ?? '-'
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
            image: product.image?.[0] ?? null,
            images: product.images ?? []
        };
    }

    return {
        formatProduct,
        populateFields,
        parseAirProductToProduct
    };
}
