<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
const app = window.Telegram.WebApp;
app.ready();
app.expand();
// app.MainButton.show();
// app.BackButton.show();
// app.CloudStorage.setItem('name', 'SKA');
app.enableClosingConfirmation();

// app.setHeaderColor('orange');
</script>

<style lang="scss" scoped></style>
