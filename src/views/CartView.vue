<template>
    <main class="cart">
        <h2 class="title">Корзина</h2>

        <ShSkeleton v-if="loader.isLoading.value" class="skeleton" />

        <template v-else>
            <div v-if="items.length === 0" class="empty">В корзине пока пусто</div>

            <div v-else class="list">
                <div v-for="it in items" :key="it.id" class="row">
                    <RouterLink
                        :to="{ name: 'product', params: { id: it.id } }"
                        class="row__image"
                    >
                        <ShImage
                            :src="it.image?.thumbnails?.large?.url || it.image?.url"
                        />
                    </RouterLink>

                    <div class="row__body">
                        <div class="row__title">Артикул: {{ it.article }}</div>
                        <div class="row__price">{{ it.priceRub }} ₽</div>

                        <div class="row__controls">
                            <ShButton kind="secondary" @click="decrement(it.id)"
                                >-</ShButton
                            >
                            <input
                                class="row__count"
                                type="number"
                                :value="it.count"
                                min="1"
                            />
                            <ShButton kind="secondary" @click="increment(it.id)"
                                >+</ShButton
                            >

                            <ShButton
                                kind="unstyled"
                                class="row__remove"
                                @click="remove(it.id)"
                            >
                                Удалить
                            </ShButton>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="items.length" class="footer">
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

import { ShButton, ShImage, ShSkeleton } from '@UI';
import { useCartPage } from '@/composables/useCartPage';

const app = window.Telegram.WebApp;

const router = useRouter();
const { loader, items, totalPrice, increment, decrement, remove, submit, error } =
    useCartPage();

app.BackButton.show();
app.BackButton.onClick(() => {
    router.push('/');
});
</script>

<style scoped lang="scss">
.cart {
    padding: 20px 8px;
}

.skeleton {
    width: 100%;
    height: 200px;
    border-radius: var(--border-radius-m);
}

.title {
    margin-bottom: 12px;
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

.row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 12px;
    align-items: center;
    padding: 8px;
    border-radius: var(--border-radius);
    background: var(--tg-theme-bg-color, var(--color-white));
}

.row__image {
    width: 90px;
    height: 90px;
    border-radius: var(--border-radius);
    overflow: hidden;
    cursor: pointer;
    transition: opacity 0.2s;
    text-decoration: none;

    &:hover {
        opacity: 0.8;
    }
}

.row__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.row__title {
    font-weight: 600;
}

.row__price {
    color: var(--tg-theme-section-header-text-color, var(--color-black));
}

.row__controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.row__count {
    width: 56px;
    height: 36px;
    text-align: center;
    border-radius: var(--border-radius-s);
}

/* Hide default number input spinners (Chrome, Safari, Edge) */
.row__count::-webkit-outer-spin-button,
.row__count::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

/* Hide default number input spinners (Firefox) */
.row__count {
    -moz-appearance: textfield;
    appearance: textfield;
}

.row__remove {
    margin-left: auto;
    color: var(--color-red);
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
