<template>
    <span :class="badgeClasses">
        <slot> {{ badgeValue }} </slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type ShBadgeT = {
    absolute?: boolean;
    value?: number | string;
    kind?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
};

const props = withDefaults(defineProps<ShBadgeT>(), {
    kind: 'primary'
});

const badgeValue = computed(() => props.value ?? '');
const badgeClasses = computed(() => {
    return {
        badge: true,
        absolute: props.absolute,
        [`badge--${props.kind}`]: true
    };
});
</script>

<style scoped lang="scss">
.badge {
    font-weight: 500;
    line-height: 1;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: auto;
    white-space: nowrap;
    text-indent: 0;
    transition: all 0.2s ease;
    padding: 4px 8px;
    min-width: unset;
    width: 20px;
    min-width: 20px;
    border-radius: 50%;
    background: var(--color-grey);
    color: var(--color-white);

    &.absolute {
        top: -8px;
        right: -8px;
        z-index: var(--z-index);
        position: absolute;
    }

    &--primary {
        background-color: var(--tg-theme-button-color, var(--color-orange));
        color: var(--tg-theme-button-text-color, var(--color-white));
    }

    &--error {
        background-color: var(--color-red);
        color: var(--color-white);
    }
}
</style>
