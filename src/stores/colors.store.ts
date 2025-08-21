import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AirRecord } from '@/common/types';
import { colorApi } from '@/composables/useAirtable';
import { COLOR_MAP } from '@/common/model';

export const useColorsStore = defineStore('colors', () => {
    const colors = ref<{ [key: string]: string }>({});

    const missingColors = computed(() => {
        return Object.keys(colors.value).filter((id) => !colors.value[id]);
    });

    function saveColors(ids: string[]) {
        ids.forEach((id) => {
            if (colors.value[id]?.length) return;
            colors.value[id] = '';
        });
    }

    async function fetchColors() {
        if (!missingColors.value.length) return;

        try {
            for (let i = 0; i < missingColors.value.length; i += 100) {
                const batch = missingColors.value.slice(i, i + 100);
                if (!batch.length) break;

                const res = await colorApi.get('/', {
                    params: {
                        filterByFormula: `OR(${batch.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                    }
                });

                const records = res.data?.records ?? [];
                records.forEach((r: AirRecord) => {
                    colors.value[r.id] = r.fields[COLOR_MAP.name] as string;
                });
            }
        } catch (err) {
            console.error('Error fetching colors:', err);
        }
    }

    return {
        colors,
        saveColors,
        fetchColors
    };
});
