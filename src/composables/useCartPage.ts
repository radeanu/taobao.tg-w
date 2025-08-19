import { computed, onMounted, ref } from 'vue';

import { productApi } from '@/composables/useAirtable';
import { PRODUCT_MAP } from '@/common/model';
import type { CartProduct, AirRecord } from '@/common/types';
import { useCartStore } from '@/composables/useCartStorage';

export function useCartPage() {
    const cartStore = useCartStore();

    const items = ref<CartProduct[]>([]);
    const counts = ref<Record<string, number>>({});
    const loader = ref<boolean>(false);

    const totalPrice = computed(() => {
        return items.value.reduce((acc, p) => {
            const c = counts.value[p.id] ?? 1;
            return acc + p.priceRub * c;
        }, 0);
    });

    onMounted(async () => {
        await fetchCartProducts();
    });

    async function fetchCartProducts() {
        const ids = cartStore.cart.map((c) => c.id);
        counts.value = cartStore.cart.reduce(
            (acc, c) => {
                acc[c.id] = c.count;
                return acc;
            },
            {} as Record<string, number>
        );

        if (!ids.length) {
            items.value = [];
            return;
        }

        try {
            loader.value = true;
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
                return {
                    id: r.id,
                    article: (r.fields as any)[PRODUCT_MAP.article] as number,
                    priceRub: (r.fields as any)[PRODUCT_MAP.priceRub] as number,
                    image: ((r.fields as any)[PRODUCT_MAP.image] ?? [])[0] ?? null
                } as CartProduct;
            });
        } catch (e) {
            console.log(e);
        } finally {
            loader.value = false;
        }
    }

    async function increment(id: string) {
        const next = (counts.value[id] ?? 1) + 1;
        counts.value[id] = next;
        await cartStore.setCount(id, next);
    }

    async function decrement(id: string) {
        const next = Math.max(1, (counts.value[id] ?? 1) - 1);
        counts.value[id] = next;
        await cartStore.setCount(id, next);
    }

    async function onCountChange(id: string, ev: Event) {
        const v = Number((ev.target as HTMLInputElement).value || '1');
        const next = Math.max(1, Math.floor(v));
        counts.value[id] = next;
        await cartStore.setCount(id, next);
    }

    async function remove(id: string) {
        await cartStore.removeFromCart(id);
        await fetchCartProducts();
    }

    return {
        loader,
        items,
        counts,
        totalPrice,
        fetchCartProducts,
        increment,
        decrement,
        onCountChange,
        remove
    };
}
