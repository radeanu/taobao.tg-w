import type { AirRecord } from '@/common/types';
import { colorApi } from '@/composables/useAirtable';
import { COLOR_MAP } from '@/common/model';

export function useColors() {
    const colors: { [key: string]: string } = {};

    async function fetchColors(ids: string[]) {
        const uniqueIds = [...new Set(ids)];

        try {
            for (let i = 0; i < uniqueIds.length; i += 100) {
                const batch = uniqueIds.slice(i, i + 100);
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

    return {
        fetchColors
    };
}
