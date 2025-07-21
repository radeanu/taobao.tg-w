<template>
    <main>
        <h3>Данные отправлены успешно</h3>
        <button @click="handleClose">Закрыть</button>
    </main>
</template>

<script setup lang="ts">
const app = window.Telegram.WebApp;

function handleClose() {
    app.close();
}
</script>

<style lang="scss">
main {
    height: calc(100% + 1px);
}
</style>
