<template>
    <div class="color-example">
        <h3>Colors Store Example</h3>

        <!-- Loading state -->
        <div v-if="colorsStore.isLoading" class="loading">Loading colors...</div>

        <!-- Error state -->
        <div v-if="colorsStore.error" class="error">Error: {{ colorsStore.error }}</div>

        <!-- Color list -->
        <div v-if="Object.keys(colorsStore.colors).length > 0" class="colors-list">
            <h4>Available Colors:</h4>
            <ul>
                <li v-for="(name, id) in colorsStore.colors" :key="id">
                    <strong>{{ id }}:</strong> {{ name }}
                </li>
            </ul>
        </div>

        <!-- Fetch colors button -->
        <div class="actions">
            <button @click="fetchSampleColors" :disabled="colorsStore.isLoading">
                Fetch Sample Colors
            </button>
            <button @click="clearColors" :disabled="colorsStore.isLoading">
                Clear Colors
            </button>
        </div>

        <!-- Get color by ID example -->
        <div class="get-color-example">
            <h4>Get Color by ID:</h4>
            <input v-model="colorId" placeholder="Enter color ID" />
            <button @click="getColor">Get Color</button>
            <div v-if="selectedColor" class="selected-color">
                Color: {{ selectedColor }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useColorsStore } from '@/stores';

const colorsStore = useColorsStore();
const colorId = ref('');
const selectedColor = ref<string | null>(null);

// Sample color IDs for demonstration
const sampleColorIds = ['rec123', 'rec456', 'rec789'];

async function fetchSampleColors() {
    await colorsStore.fetchColors(sampleColorIds);
}

function clearColors() {
    colorsStore.clearColors();
    selectedColor.value = null;
}

function getColor() {
    if (colorId.value) {
        selectedColor.value = colorsStore.getColorById(colorId.value);
    }
}
</script>

<style scoped>
.color-example {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 20px 0;
}

.loading {
    color: #007bff;
    font-style: italic;
}

.error {
    color: #dc3545;
    background-color: #f8d7da;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
}

.colors-list {
    margin: 20px 0;
}

.colors-list ul {
    list-style: none;
    padding: 0;
}

.colors-list li {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}

.actions {
    margin: 20px 0;
}

.actions button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.actions button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.actions button:hover:not(:disabled) {
    background-color: #0056b3;
}

.get-color-example {
    margin: 20px 0;
}

.get-color-example input {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.get-color-example button {
    padding: 8px 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.get-color-example button:hover {
    background-color: #218838;
}

.selected-color {
    margin-top: 10px;
    padding: 10px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    color: #155724;
}
</style>
