import { onMounted, ref } from 'vue';

import { orderApi } from '@/composables/useAirtable';
import type { AirRecord, Order } from '@/common/types';
import { useClient } from '@/composables/useClient';
import { useLoading } from '@/composables/useLoading';
import { ORDER_MAP } from '@/common/model';

export function useClientOrders() {
    const { findOrCreateClient } = useClient();
    const loading = useLoading();

    const orders = ref<Order[]>([]);

    onMounted(async () => {
        await fetchOrders();
    });

    async function fetchOrders() {
        try {
            loading.start();
            const client = await findOrCreateClient();
            if (!client) return;

            const ordersRes = await orderApi.get('/', {
                params: {
                    filterByFormula: `{${ORDER_MAP.clientTgId}} = ${client.tg_id}`
                }
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
            console.error('Error fetching orders:', error);
        } finally {
            loading.end();
        }
    }

    return {
        loading,
        orders
    };
}
