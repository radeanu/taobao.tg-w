<template>
    <RouterView />
    <div class="app-version">v{{ v }}</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

const app = window.Telegram.WebApp;
app.ready();

const v = APP_VERSION ?? '0.0.0';
</script>

<style lang="scss" scoped>
.app-version {
    width: 100%;
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 300;
    z-index: 1000;
    color: var(--tg-theme-hint-color, var(--color-gray-600));
    background-color: var(--tg-theme-bg-color, var(--color-white));
}
</style>
