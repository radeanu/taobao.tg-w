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

    const cartProducts = ref<CartProduct[]>([]);
    const error = ref<string | null>(null);

    const totalPrice = computed(() => {
        return cartProducts.value.reduce((acc, p) => {
            return acc + p.priceRub * p.cart.count;
        }, 0);
    });

    onMounted(async () => {
        await cartStore.fetchCart();
        await fetchCartProducts();
    });

    async function removeProduct(id: string) {
        await cartStore.removeFromCart(id);
        await fetchCartProducts();
    }

    async function fetchCartProducts() {
        const ids = [...new Set(cartStore.cart.map((c) => c.productId))];
        if (!ids.length) {
            cartProducts.value = [];
            return;
        }

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

            const products = records.map((record: AirRecord) =>
                parseAirProductToProduct(record)
            );

            cartProducts.value = cartStore.cart
                .map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;

                    const color = product.colors.find((c) => c.id === item.colorId);
                    const size = product.sizes.find((s) => s.id === item.sizeId);

                    return {
                        ...product,
                        cart: {
                            ...item,
                            color,
                            size
                        }
                    };
                })
                .filter((v) => v !== null);
        } catch (e) {
            console.log(e);
        } finally {
            loader.end();
        }
    }

    async function submit() {
        try {
            error.value = null;
            loader.start();

            const result = await createOrder.createOrder(cartProducts.value);

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
        error,
        loader,
        submit,
        totalPrice,
        cartProducts,
        removeProduct,
        fetchCartProducts
    };
}
