import { POSITION_MAP } from '@/common/model';
import type { AirPosition, AirRecord, Position } from '@/common/types';
import { useColorsStore } from '@/stores/colors.store';
import { useSizesStore } from '@/stores/sizes.store';

export function usePosition() {
    const sizesStore = useSizesStore();
    const colorsStore = useColorsStore();

    async function populateFields(positions: AirRecord[]) {
        const colors: string[] = [];
        const sizes: string[] = [];

        positions.forEach((item: AirRecord) => {
            const colorsL = (item.fields[POSITION_MAP.color] ?? []) as string[];
            const sizesL = (item.fields[POSITION_MAP.size] ?? []) as string[];

            colors.push(...colorsL);
            sizes.push(...sizesL);
        });

        colorsStore.saveColors(colors);
        sizesStore.saveSizes(sizes);

        await Promise.allSettled([colorsStore.fetchColors(), sizesStore.fetchSizes()]);
    }

    function parseAirPositionToPosition(record: AirRecord): Position {
        const payload = {
            id: record.id,
            price: record.fields?.[POSITION_MAP.price],
            count: record.fields?.[POSITION_MAP.count],
            colors: record.fields?.[POSITION_MAP.color] ?? [],
            sizes: record.fields?.[POSITION_MAP.size] ?? [],
            products: record.fields?.[POSITION_MAP.products] ?? [],
            article: record.fields?.[POSITION_MAP.article] ?? []
        } as AirPosition;

        return formatPosition(payload);
    }

    function formatPosition(pos: AirPosition): Position {
        const colorsL = pos.colors.map((cId) => {
            return {
                id: cId,
                name: colorsStore.colors[cId]
            };
        });

        const sizesL = pos.sizes.map((sId) => {
            return {
                id: sId,
                name: sizesStore.sizes[sId]
            };
        });

        return {
            id: pos.id,
            price: pos.price,
            count: pos.count,
            size: sizesL[0]?.name,
            color: colorsL[0].name,
            product: {
                id: pos.products[0],
                article: pos.article[0]
            }
        };
    }

    return {
        formatPosition,
        populateFields,
        parseAirPositionToPosition
    };
}
