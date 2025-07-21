<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
const app = window.Telegram.WebApp;

app.setBackgroundColor('red');
app.setBottomBarColor('blue');
app.setHeaderColor('orange');
</script>

<style lang="scss" scoped></style>
