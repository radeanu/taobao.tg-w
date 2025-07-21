<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
const app = window.Telegram.WebApp;
app.ready();

Object.entries(app.themeParams).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
});
</script>

<style lang="scss" scoped></style>
