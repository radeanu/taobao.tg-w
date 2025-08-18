import { onMounted, ref } from 'vue';
import { defineStore } from 'pinia';

import type { CartItem } from '@/common/types';

export const cartStore = defineStore('cart', () => {
    const app = window.Telegram.WebApp;
    const user = app.initDataUnsafe.user;
    const storage = app.CloudStorage;
    const uid = user?.id.toString();

    const cart = ref<CartItem[]>([]);

    onMounted(async () => {
        await fetchCart();
    });

    function addToCart(id: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (!uid) return resolve(false);

            await fetchCart();
            cart.value.push({ id, count: 1 });

            storage.setItem(
                uid,
                JSON.stringify({ products: cart.value }),
                (error, success) => {
                    return error || !success ? resolve(false) : resolve(true);
                }
            );
        });
    }

    function fetchCart() {
        return new Promise((resolve) => {
            if (!uid) return resolve(null);

            storage.getItem(uid, (error, data) => {
                if (error || !data) return resolve(null);

                const parsed = JSON.parse(data) as { products: CartItem[] };
                cart.value = parsed.products;
                return resolve(null);
            });
        });
    }

    return {
        cart,
        fetchCart,
        addToCart
    };
});
