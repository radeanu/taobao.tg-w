import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

import type { CartItem } from '@/common/types';
import { useStorage } from '@/composables/useStorage';

export const useCartStore = defineStore('cart', () => {
    const storage = useStorage();

    const cart = ref<CartItem[]>([]);

    onMounted(async () => {
        await fetchCart();
    });

    async function addToCart(id: string) {
        await fetchCart();

        const existing = cart.value.find((v) => v.id === id);
        if (existing) return;

        cart.value.push({ id, count: 1 });

        return storage.setItem('cart', JSON.stringify({ products: cart.value }));
    }

    async function removeFromCart(id: string) {
        await fetchCart();
        cart.value = cart.value.filter((v) => v.id !== id);

        return storage.setItem('cart', JSON.stringify({ products: cart.value }));
    }

    async function fetchCart() {
        try {
            const data = await storage.getItem('cart');
            if (!data) return;

            const parsed = JSON.parse(data) as { products: CartItem[] };
            cart.value = parsed.products ?? [];
        } catch (e) {
            console.log(e);
        }
    }

    async function setCount(id: string, count: number) {
        await fetchCart();
        const item = cart.value.find((v) => v.id === id);
        if (!item) return false;

        item.count = count;

        return storage.setItem(
            'cart',
            JSON.stringify({ products: cart.value.filter((v) => v.count > 0) })
        );
    }

    async function clearCart() {
        cart.value = [];
        return storage.setItem('cart', JSON.stringify({ products: [] }));
    }

    return {
        cart,
        setCount,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart
    };
});
