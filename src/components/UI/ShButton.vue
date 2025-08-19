<template>
    <button :class="btnClasses" type="button" @click="$emit('click')">
        <slot name="icon-left" :value="iconLeft">
            <sh-icon v-if="iconLeft" :name="iconLeft" />
        </slot>

        <slot name="label" :value="label">
            <span v-if="label" class="label">{{ label }}</span>
        </slot>

        <slot name="icon-right" :value="iconRight">
            <sh-icon v-if="iconRight" :name="iconRight" />
        </slot>

        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ShIcon from './ShIcon.vue';

export type ShButtonT = {
    label?: string;
    iconLeft?: string;
    iconRight?: string;
    fullWidth?: boolean;
    kind?: 'primary' | 'secondary' | 'telegram' | 'unstyled';
};

const $emit = defineEmits<{ (e: 'click'): void }>();
const props = withDefaults(defineProps<ShButtonT>(), { kind: 'primary' });

const btnClasses = computed(() => {
    if (props.kind === 'unstyled') return {};

    return {
        btn: true,
        [`btn-${props.kind}`]: true,
        ['btn-fill']: props.fullWidth
    };
});
</script>

<style scoped lang="scss">
.btn {
    display: flex;
    cursor: pointer;
    overflow: hidden;
    align-items: center;
    justify-content: center;

    gap: 10px;
    width: auto;
    height: 52px;
    padding: 0 20px;
    border-radius: var(--border-radius);
    border-width: 1px;
    border-style: solid;

    &:disabled {
        pointer-events: none;
        cursor: default;
        opacity: 0.5;
    }

    .label {
        width: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.btn-fill {
    width: 100%;
}

.btn-primary {
    color: var(--color-white);
    border-color: var(--color-orange);
    background-color: var(--color-orange);

    --icon-color: var(--color-white);

    &:hover {
        border-color: var(--color-orange-dark);
        background-color: var(--color-orange-dark);
    }
}

.btn-secondary {
    color: var(--color-white);
    border-color: var(--color-grey);
    background-color: var(--color-grey);

    --icon-color: var(--color-white);

    &:hover {
        border-color: var(--color-black);
        background-color: var(--color-black);
    }
}

.btn-telegram {
    color: var(--tg-theme-button-text-color, var(--color-white));
    border-color: var(--tg-theme-button-color, var(--color-grey));
    background-color: var(--tg-theme-button-color, var(--color-grey));

    --icon-color: var(--tg-theme-button-text-color, var(--color-white));
}
</style>
