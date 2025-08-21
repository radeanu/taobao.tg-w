import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AirRecord } from '@/common/types';
import { sizeApi } from '@/composables/useAirtable';
import { SIZE_MAP } from '@/common/model';

export const useSizesStore = defineStore('sizes', () => {
    const sizes = ref<{ [key: string]: string }>({});

    const missingSizes = computed(() => {
        return Object.keys(sizes.value).filter((id) => !sizes.value[id]);
    });

    function saveSizes(ids: string[]) {
        ids.forEach((id) => {
            if (sizes.value[id]?.length) return;
            sizes.value[id] = '';
        });
    }

    async function fetchSizes() {
        if (!missingSizes.value.length) return;

        try {
            for (let i = 0; i < missingSizes.value.length; i += 100) {
                const batch = missingSizes.value.slice(i, i + 100);
                if (!batch.length) break;

                const res = await sizeApi.get('/', {
                    params: {
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    }
                });

                const records = res.data?.records ?? [];
                records.forEach((r: AirRecord) => {
                    sizes.value[r.id] = r.fields[SIZE_MAP.name] as string;
                });
            }
        } catch (err) {
            console.error('Error fetching colors:', err);
        }
    }

    return {
        sizes,
        saveSizes,
        fetchSizes
    };
});
