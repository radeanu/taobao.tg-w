<template>
    <main>
        <h3>Form example v6</h3>

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
import { useRouter } from 'vue-router';

const app = window.Telegram.WebApp;
const storage = ref(window.Telegram.WebApp.CloudStorage);
const name = ref<string | null>();

const router = useRouter();

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

async function handleSubmit() {
    router.push('/success');
}
</script>

<style lang="scss">
main {
    height: calc(100% + 1px);
}

h3 {
    color: var(--section_header_text_color);
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

button {
    color: var(--button_text_color);
    background-color: var(--button_color);
}
</style>
