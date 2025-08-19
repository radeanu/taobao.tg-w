<template>
    <span class="badge" :class="[`badge--${kind}`, { 'badge--rounded': rounded }]">
        <slot />
    </span>
</template>

<script setup lang="ts">
export type ShBadgeT = {
    kind?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    rounded?: boolean;
};

withDefaults(defineProps<ShBadgeT>(), {
    kind: 'primary',
    rounded: false
});
</script>

<style lang="scss" scoped>
.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    border-radius: var(--border-radius-s);
    transition: all 0.2s ease;
    padding: 4px 8px;
    font-size: 12px;
    min-width: 20px;
    height: 20px;
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 11;

    // Rounded variant
    &--rounded {
        border-radius: 50%;
        min-width: unset;
        width: 20px;
    }

    // Color variants
    &--primary {
        background-color: var(--tg-theme-button-color, var(--color-blue));
        color: var(--tg-theme-button-text-color, var(--color-white));
    }

    &--secondary {
        background-color: var(--color-grey2);
        color: var(--color-grey6);
    }

    &--success {
        background-color: var(--color-green);
        color: var(--color-white);
    }

    &--warning {
        background-color: var(--color-orange);
        color: var(--color-white);
    }

    &--error {
        background-color: var(--color-red);
        color: var(--color-white);
    }

    &--info {
        background-color: var(--color-blue);
        color: var(--color-white);
    }
}
</style>
