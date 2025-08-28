import { ref } from 'vue';

import type { AirRecord, Position } from '@/common/types';
import { useLoading } from '@/composables/useLoading';
import { positionApi } from '@/composables/useAirtable';
import { useGlobalNotification } from '@/composables/useNotification';
import { usePosition } from '@/composables/usePosition';

export function usePositionsList() {
    const loader = useLoading();
    const notification = useGlobalNotification();
    const { parseAirPositionToPosition, populateFields } = usePosition();

    const positions = ref<Position[]>([]);

    async function fetchPositionsList(ids: string[]) {
        try {
            positions.value = [];
            loader.start();

            const response = await positionApi.get('/', {
                params: {
                    filterByFormula: `OR(${ids.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
                }
            });

            const records = (response.data?.records ?? []) as AirRecord[];

            await populateFields(records);

            positions.value = records.map((record) => {
                return parseAirPositionToPosition(record);
            });
        } catch (error) {
            notification.error('Ошибка при загрузке позиций заказа');
        } finally {
            loader.end();
        }
    }

    return {
        loader,
        positions,
        fetchPositionsList
    };
}
