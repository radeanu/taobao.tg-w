<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
const app = window.Telegram.WebApp;
app.ready();
app.expand();
app.sendData('Hello');

// app.setHeaderColor('orange');
</script>

<style lang="scss" scoped></style>
