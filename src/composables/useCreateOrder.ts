import { ref } from 'vue';

import type { CartProduct, AirRecord } from '@/common/types';
import { ORDER_MAP, POSITION_MAP } from '@/common/model';
import { orderApi, positionApi } from '@/composables/useAirtable';
import { useClient } from '@/composables/useClient';

export function useCreateOrder() {
    const { findOrCreateClient } = useClient();
    const positions = ref<Array<{ id: string; product: string }>>([]);

    async function _createPosition(item: CartProduct) {
        const fields = {
            [POSITION_MAP.count]: item.cart.count,
            [POSITION_MAP.color]: [item.cart.colorId],
            [POSITION_MAP.products]: [item.cart.productId]
        };

        if (item.cart.sizeId) {
            fields[POSITION_MAP.size] = [item.cart.sizeId];
        }

        const res = await positionApi.post('/', { fields });

        const payload = res.data as AirRecord;
        if (!payload.id) return;

        positions.value.push({ id: payload.id, product: item.cart.productId });
    }

    async function createOrder(
        items: CartProduct[]
    ): Promise<{ success: boolean; message: string }> {
        try {
            const client = await findOrCreateClient();
            if (!client) {
                return { success: false, message: 'Ошибка при создании заказа' };
            }

            const orderRes = await orderApi.post('/', {
                fields: {
                    [ORDER_MAP.clients]: [client.id]
                }
            });

            const orderRecord = orderRes.data as AirRecord;
            if (!orderRecord.id) {
                return { success: false, message: 'Ошибка при создании заказа' };
            }

            await Promise.all(items.map((item) => _createPosition(item)));

            await orderApi.patch(`/${orderRecord.id}`, {
                fields: {
                    [ORDER_MAP.status]: ORDER_MAP.newStatus,
                    [ORDER_MAP.positions]: positions.value.map((pos) => pos.id)
                }
            });

            return { success: true, message: '' };
        } catch (error) {
            console.error('Error creating order:', error);
            return {
                success: false,
                message: 'Ошибка при создании заказа. Попробуйте еще раз.'
            };
        }
    }

    return {
        createOrder
    };
}
