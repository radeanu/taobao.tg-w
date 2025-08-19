import { defineStore } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';

import type { CartItem } from '@/common/types';

export const cartStore = defineStore('cart', () => {
    const app = window.Telegram.WebApp;
    const user = app.initDataUnsafe.user;
    const storage = app.CloudStorage;
    const uid = user?.id.toString();

    const cart = ref<CartItem[]>([]);

    watchEffect(() => {
        console.log(JSON.parse(JSON.stringify(cart.value)));
    });

    const cartLength = computed(() => {
        return cart.value.length;
    });

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

    function removeFromCart(id: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (!uid) return resolve(false);

            await fetchCart();
            cart.value = cart.value.filter((v) => v.id !== id);

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
                console.log(parsed);
                cart.value = parsed.products;
                return resolve(null);
            });
        });
    }

    return {
        cart,
        fetchCart,
        addToCart,
        cartLength,
        removeFromCart
    };
});
