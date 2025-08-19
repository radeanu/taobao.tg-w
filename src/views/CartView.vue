<template>
    <main class="cart">
        <h2 class="title">Корзина</h2>

        <div v-if="items.length === 0 && !loader" class="empty">В корзине пока пусто</div>

        <div v-else class="list">
            <div v-for="it in items" :key="it.id" class="row">
                <div class="row__image">
                    <ShImage :src="it.image?.thumbnails?.small?.url || it.image?.url" />
                </div>

                <div class="row__body">
                    <div class="row__title">Артикул: {{ it.article }}</div>
                    <div class="row__price">{{ it.priceRub }} ₽</div>

                    <div class="row__controls">
                        <ShButton kind="secondary" @click="decrement(it.id)">-</ShButton>
                        <input
                            class="row__count"
                            type="number"
                            :value="counts[it.id] || 1"
                            min="1"
                            @change="onCountChange(it.id, $event)"
                        />
                        <ShButton kind="secondary" @click="increment(it.id)">+</ShButton>

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
            <div class="total">Итого: {{ totalPrice }} ₽</div>
            <ShButton kind="telegram" full-width @click="submit">Оформить</ShButton>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ShButton, ShImage } from '@UI';
import { useCartPage } from '@/composables/useCartPage';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
    loader,
    items,
    counts,
    totalPrice,
    fetchCartProducts,
    increment,
    decrement,
    onCountChange,
    remove
} = useCartPage();

function submit() {
    router.push('/success');
}
</script>

<style scoped lang="scss">
.cart {
    padding: 20px 8px;
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
}

.total {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}
</style>
