<template>
    <RouterView />
    <BottomNavigation />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BottomNavigation from '@/components/BottomNavigation.vue';

const app = window.Telegram.WebApp;
app.ready();
</script>

<style lang="scss" scoped></style>
