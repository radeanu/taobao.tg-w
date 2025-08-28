import { ref, watch } from 'vue';

import { orderApi } from '@/composables/useAirtable';
import type { AirRecord, Order } from '@/common/types';
import { useClient } from '@/composables/useClient';
import { useLoading } from '@/composables/useLoading';
import { ORDER_MAP } from '@/common/model';
import { useGlobalNotification } from '@/composables/useNotification';

export function useClientOrders() {
    const loading = useLoading();
    const { findOrCreateClient } = useClient();
    const notification = useGlobalNotification();

    const orders = ref<Order[]>([]);
    const orderType = ref<'new' | 'archive'>('new');

    watch(
        orderType,
        async () => {
            await fetchOrders();
        },
        { immediate: true }
    );

    async function fetchOrders() {
        try {
            loading.start();
            const client = await findOrCreateClient();

            if (!client) {
                notification.error('Не удалось получить заказы');
                return;
            }

            const statusFilter =
                orderType.value === 'new' ? ORDER_MAP.newStatus : ORDER_MAP.archiveStatus;

            const filterByFormula = `AND({${ORDER_MAP.clientTgId}} = ${client.tg_id}, {${ORDER_MAP.status}} = "${statusFilter}")`;

            const ordersRes = await orderApi.get('/', {
                params: { filterByFormula }
            });

            const records = (ordersRes.data.records ?? []) as AirRecord[];

            orders.value = records.map((order) => ({
                id: order.id,
                number: order.fields[ORDER_MAP.number] as number,
                createdAt: order.fields[ORDER_MAP.createdAt] as string,
                status: order.fields[ORDER_MAP.status] as string,
                price: order.fields[ORDER_MAP.price] as number,
                positions: order.fields[ORDER_MAP.positions] as string[]
            }));
        } catch (error) {
            console.error(error);
            notification.error('Не удалось получить заказы');
        } finally {
            loading.end();
        }
    }

    return {
        orders,
        loading,
        orderType
    };
}
