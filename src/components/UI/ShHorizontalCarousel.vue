<template>
    <div class="horizontal-carousel">
        <ShButton
            @click="scroll('left')"
            class="carousel-btn left-btn"
            aria-label="Scroll Left"
            kind="unstyled"
        >
            ◀
        </ShButton>

        <div class="carousel-content-wrapper" ref="contentWrapper">
            <div class="carousel-content">
                <div
                    v-for="(item, index) in items"
                    :key="index"
                    class="carousel-item"
                    ref="carouselItem"
                >
                    <slot :item="item"></slot>
                </div>
            </div>
        </div>

        <ShButton
            @click="scroll('right')"
            class="carousel-btn right-btn"
            aria-label="Scroll Right"
            kind="unstyled"
        >
            ▶
        </ShButton>
    </div>
</template>

<script setup lang="ts" generic="T">
import { ref, useTemplateRef } from 'vue';

import ShButton from './ShButton.vue';

defineProps<{ items: T[] }>();

const contentWrapper = ref<HTMLElement | null>(null);
const carouselItem = useTemplateRef<HTMLDivElement[] | null>('carouselItem');

function scroll(direction: 'left' | 'right') {
    if (!contentWrapper.value || !carouselItem.value?.[0]) return;

    const itemWidth = carouselItem.value[0].clientWidth;
    const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
    contentWrapper.value.scrollLeft += scrollAmount;
}
</script>

<style lang="scss" scoped>
.horizontal-carousel {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--tg-button-color, var(--color-grey4));
    border-radius: 8px;
    overflow: hidden;
}

.carousel-btn {
    background: var(--tg-secondary-bg-color, var(--color-white));
    border: none;
    padding: 10px 8px;
    cursor: pointer;
    height: 100%;
    transition: background-color 0.2s;
    color: var(--tg-text-color, var(--color-black));

    &:hover {
        background-color: var(--tg-hint-color, var(--color-grey4));
    }
}

.left-btn {
    border-right: 1px solid var(--tg-button-color, var(--color-grey4));
}

.right-btn {
    border-left: 1px solid var(--tg-button-color, var(--color-grey4));
}

.carousel-content-wrapper {
    display: flex;
    overflow-x: hidden;
    scroll-behavior: smooth;
    flex-grow: 1;
}

.carousel-content {
    display: flex;
}

.carousel-item {
    padding: 10px;
    text-align: center;
    border-right: 1px solid var(--tg-button-color, var(--color-grey4));
    color: var(--tg-text-color, var(--color-black));

    &:last-child {
        border-right: none;
    }
}
</style>
