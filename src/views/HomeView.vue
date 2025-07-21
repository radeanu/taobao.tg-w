<template>
    <main>
        <h3>Form example</h3>

        <form @submit.prevent>
            <input type="text" name="name" v-model="payload.name" />
            <input type="number" name="number" v-model="payload.number" />

            <input type="file" name="file" @change="onFileChange" />
        </form>

        <pre>{{ payload }}</pre>

        <pre>{{ app }}</pre>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const app = window.Telegram.WebApp;
console.log(app);

// app.setBackgroundColor('bg_color');

const payload = ref<{
    name: string;
    number: number;
    files: FileList | null;
}>({
    name: '',
    number: 0,
    files: null
});

function onFileChange(ev: Event) {
    const target = ev?.target as HTMLInputElement;
    if (!target.files?.length) return;

    payload.value.files = target.files;
}
</script>

<style lang="scss">
main {
    // width: 100%;
    // height: 100%;
    height: calc(100% + 1px);
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    color: #111111;
}
</style>
