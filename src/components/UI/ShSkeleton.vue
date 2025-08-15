<template>
    <div class="skeleton container-inherit" />
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.container-inherit {
    width: inherit;
    height: inherit;
    min-width: inherit;
    min-height: inherit;
    max-width: inherit;
    max-height: inherit;
    border-radius: inherit;
}

.skeleton {
    z-index: var(--z-index);
    overflow: hidden;
    position: relative;
    transition: all 0.3s;
    background-color: var(--color-grey2);

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
            90deg,
            rgba(#ffffff, 0) 0,
            rgba(#ffffff, 0.2) 30%,
            rgba(#ffffff, 0.3) 70%,
            rgba(#ffffff, 0)
        );
        animation: shimmer 1s infinite;
        content: '';
    }
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
