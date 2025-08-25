<template>
    <svg class="sh-icon" aria-hidden="true">
        <use :xlink:href="'#icon-' + name" />
    </svg>
</template>

<script setup lang="ts">
export type ShIconT = {
    name: string;
};

defineProps<ShIconT>();
</script>

<style lang="scss" scoped>
.sh-icon {
    overflow: hidden;
    fill: transparent;
    color: var(--icon-color, inherit);
    width: var(--icon-width, 20px);
    height: var(--icon-height, 20px);
}
</style>
