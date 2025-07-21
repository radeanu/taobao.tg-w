<template>
    <main>
        <h3>Form example v4</h3>

        <form @submit.prevent>
            <input type="text" name="name" v-model="payload.name" />
            <input type="number" name="number" v-model="payload.number" />

            <input type="file" name="file" @change="onFileChange" />

            <button @click="handleSubmit">Submit</button>
        </form>

        <pre>{{ name }}</pre>

        <pre>{{ payload }}</pre>
        <pre>{{ app }}</pre>
    </main>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const app = window.Telegram.WebApp;
const storage = ref(window.Telegram.WebApp.CloudStorage);
const name = ref<string | null>();
// app.setBackgroundColor('bg_color');

watchEffect(() => {
    storage.value.getItem('name', (v) => {
        name.value = v;
    });
});

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

function handleSubmit() {
    payload.value.name = 'SENDED';
    app.sendData('Hello');
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
