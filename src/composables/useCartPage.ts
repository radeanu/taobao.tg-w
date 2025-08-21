import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

import { useProduct } from './useProduct';
import { PRODUCT_MAP } from '@/common/model';
import { useLoading } from '@/composables/useLoading';
import { productApi } from '@/composables/useAirtable';
import { useCartStore } from '@/composables/useCartStorage';
import type { CartProduct, AirRecord } from '@/common/types';
import { useCreateOrder } from '@/composables/useCreateOrder';

export function useCartPage() {
    const loader = useLoading();
    const router = useRouter();
    const cartStore = useCartStore();
    const createOrder = useCreateOrder();
    const { parseAirProductToProduct, populateFields } = useProduct();

    const items = ref<CartProduct[]>([]);
    const error = ref<string | null>(null);

    const totalPrice = computed(() => {
        return items.value.reduce((acc, p) => {
            return acc + p.priceRub * p.count;
        }, 0);
    });

    onMounted(async () => {
        await cartStore.fetchCart();
        await fetchCartProducts();
    });

    async function fetchCartProducts() {
        const ids = cartStore.cart.map((c) => c.id);
        if (!ids.length) return;

        try {
            loader.start();
            const res = await productApi.get('/', {
                params: {
                    fields: Object.values(PRODUCT_MAP),
                    filterByFormula: `OR(${ids
                        .map((id) => `RECORD_ID() = '${id}'`)
                        .join(',')})`,
                    pageSize: ids.length
                }
            });

            const records = (res.data?.records ?? []) as AirRecord[];

            await populateFields(records);

            items.value = records.map((r: AirRecord) => {
                const cartItem = cartStore.cart.find((c) => c.id === r.id);
                const parsedProduct = parseAirProductToProduct(r);

                return {
                    ...parsedProduct,
                    count: cartItem?.count ?? 1
                };
            });
        } catch (e) {
            console.log(e);
        } finally {
            loader.end();
        }
    }

    async function updateCount(id: string, count: number) {
        const targetIdx = items.value.findIndex((i) => i.id === id);
        if (targetIdx === -1) return;

        await cartStore.setCount(id, count);
        items.value[targetIdx].count = count;

        if (count === 0) {
            items.value.splice(targetIdx, 1);
        }
    }

    async function submit() {
        try {
            error.value = null;
            loader.start();

            const result = await createOrder.createOrder(items.value);

            if (!result.success) {
                error.value = result.message;
                return;
            }

            await cartStore.clearCart();
            router.push('/success');
        } catch (e) {
            console.log(e);
            error.value = 'Ошибка при создании заказа. Попробуйте еще раз.';
        } finally {
            loader.end();
        }
    }

    return {
        items,
        loader,
        error,
        submit,
        totalPrice,
        updateCount,
        fetchCartProducts
    };
}
