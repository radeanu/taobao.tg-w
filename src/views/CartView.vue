<template>
    <main class="cart">
        <div class="header">
            <RouterLink to="/">
                <ShButton kind="unstyled" class="back-button" label="←" />
            </RouterLink>

            <h2 class="title">Корзина</h2>
        </div>

        <ShSkeleton v-if="loader.isLoading.value" class="skeleton" />

        <template v-else>
            <div v-if="!cartProducts.length" class="empty">В корзине пока пусто</div>

            <div v-else class="list">
                <CartProduct
                    v-for="(product, idx) in cartProducts"
                    :key="product.cart.id"
                    v-model="cartProducts[idx]"
                    @remove="removeProduct(product.cart.id)"
                />
            </div>

            <div v-if="cartProducts.length" class="footer">
                <div v-if="error" class="error-message">
                    <div class="error-text">{{ error }}</div>
                    <ShButton kind="unstyled" class="error-close" @click="error = null">
                        ✕
                    </ShButton>
                </div>
                <div class="total">Итого: {{ totalPrice }} ₽</div>
                <ShButton kind="telegram" full-width @click="submit">Оформить</ShButton>
            </div>
        </template>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ShButton, ShSkeleton } from '@UI';
import { useCartPage } from '@/composables/useCartPage';
import CartProduct from '@/components/CartProduct.vue';

const app = window.Telegram.WebApp;

const router = useRouter();
const { cartProducts, loader, error, totalPrice, removeProduct, submit } = useCartPage();

app.BackButton.show();
app.BackButton.onClick(() => {
    router.push('/');
});
</script>

<style scoped lang="scss">
.cart {
    padding: 20px 8px;
    padding-bottom: 100px;
}

.header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.back-button {
    padding: 8px;
    color: var(--tg-theme-link-color, var(--color-blue));
    background: none;
    border: none;
    cursor: pointer;
}

.title {
    margin: 0;
    flex: 1;
}

.skeleton {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius-m);
}

.empty {
    padding: 30px 0;
    text-align: center;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.footer {
    position: sticky;
    bottom: 0;
    gap: 10px;
    display: grid;
    grid-template-columns: 1fr;
    padding-top: 12px;
    background: var(--tg-theme-bg-color, var(--color-white));
    z-index: 3;
}

.total {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}

.error-message {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 12px;
    background: var(--color-red-light, #fee);
    border: 1px solid var(--color-red, #e53e3e);
    border-radius: var(--border-radius);
    color: var(--color-red, #e53e3e);
}

.error-text {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
}

.error-close {
    margin-left: 8px;
    padding: 4px;
    font-size: 16px;
    color: var(--color-red, #e53e3e);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
        background: var(--color-red, #e53e3e);
        color: white;
    }
}
</style>
