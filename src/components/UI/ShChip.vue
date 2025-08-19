<template>
    <component
        :is="tag"
        class="chip"
        :class="{ 'chip--active': active }"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        tag?: string;
        active?: boolean;
        click?: (event: MouseEvent) => void;
    }>(),
    {
        tag: 'div',
        active: false
    }
);

const $emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>();
</script>

<style lang="scss" scoped>
.chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid var(--tg-button-color, var(--color-grey4));
    background-color: var(--tg-bg-color, var(--color-white));
    color: var(--tg-text-color, var(--color-black));
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: var(--tg-button-color, var(--color-black));
    }

    &--active {
        border-color: var(--tg-button-color, var(--color-black));
        background-color: var(--tg-secondary-bg-color, var(--color-grey4));
    }
}
</style>
