import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

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
                    fields: [
                        PRODUCT_MAP.article,
                        PRODUCT_MAP.priceRub,
                        PRODUCT_MAP.image
                    ],
                    filterByFormula: `OR(${ids
                        .map((id) => `RECORD_ID() = '${id}'`)
                        .join(',')})`,
                    pageSize: ids.length
                }
            });

            const records = (res.data?.records ?? []) as AirRecord[];
            items.value = records.map((r) => {
                const cartItem = cartStore.cart.find((c) => c.id === r.id);

                return {
                    id: r.id,
                    count: cartItem?.count ?? 1,
                    article: (r.fields as any)[PRODUCT_MAP.article] as number,
                    priceRub: (r.fields as any)[PRODUCT_MAP.priceRub] as number,
                    image: ((r.fields as any)[PRODUCT_MAP.image] ?? [])[0] ?? null
                } as CartProduct;
            });
        } catch (e) {
            console.log(e);
        } finally {
            loader.end();
        }
    }

    async function increment(id: string) {
        const targetIdx = items.value.findIndex((i) => i.id === id);
        if (targetIdx === -1) return;

        const newCount = items.value[targetIdx].count + 1;
        items.value[targetIdx].count = newCount;
        await cartStore.setCount(id, newCount);
    }

    async function decrement(id: string) {
        const targetIdx = items.value.findIndex((i) => i.id === id);
        if (targetIdx === -1) return;

        const newCount = Math.max(1, items.value[targetIdx].count - 1);
        items.value[targetIdx].count = newCount;
        await cartStore.setCount(id, newCount);
    }

    async function remove(id: string) {
        await cartStore.removeFromCart(id);
        await fetchCartProducts();
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
        remove,
        submit,
        decrement,
        increment,
        totalPrice,
        fetchCartProducts
    };
}
