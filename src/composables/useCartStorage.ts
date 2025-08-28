import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

import * as utils from '@/common/utils';
import type { CartItem } from '@/common/types';
import { useStorage } from '@/composables/useStorage';
import { useGlobalNotification } from '@/composables/useNotification';

const CART_VERSION = 1;

export const useCartStore = defineStore('cart', () => {
    const storage = useStorage();
    const notification = useGlobalNotification();
    const cart = ref<CartItem[]>([]);

    onMounted(async () => {
        await fetchCart();
    });

    function _submitCart() {
        return storage.setItem(
            'cart',
            JSON.stringify({ products: cart.value.filter((v) => v.count > 0) })
        );
    }

    function _findCartItem(
        v: CartItem,
        productId: string,
        sizeId: string | null,
        colorId: string
    ) {
        return v.productId === productId && v.sizeId === sizeId && v.colorId === colorId;
    }

    async function addToCart(productId: string, sizeId: string | null, colorId: string) {
        await fetchCart();

        const existing = cart.value.find((v) => {
            return _findCartItem(v, productId, sizeId, colorId);
        });
        if (existing) return;

        cart.value.push({
            _v: CART_VERSION,
            id: utils.generateUUID(),
            productId,
            count: 1,
            sizeId,
            colorId
        });

        return _submitCart();
    }

    function removeFromCartByProductId(productId: string) {
        cart.value = cart.value.filter((v) => v.productId !== productId);

        return _submitCart();
    }

    async function removeFromCart(id: string) {
        await fetchCart();
        cart.value = cart.value.filter((v) => v.id !== id);

        return _submitCart();
    }

    async function fetchCart() {
        try {
            const data = await storage.getItem('cart');
            if (!data) return;

            const parsed = JSON.parse(data) as { products: CartItem[] };
            const list = parsed.products ?? [];

            cart.value = list.filter((v) => v._v === CART_VERSION && v.count > 0);
        } catch (e) {
            console.error(e);
            notification.error('Не удалось получить продукты');
        }
    }

    async function setCount(id: string, count: number) {
        await fetchCart();
        const item = cart.value.find((v) => v.id === id);
        if (!item) return false;

        item.count = count;

        return _submitCart();
    }

    async function clearCart() {
        cart.value = [];
        return _submitCart();
    }

    return {
        cart,
        setCount,
        fetchCart,
        addToCart,
        clearCart,
        removeFromCart,
        removeFromCartByProductId
    };
});
