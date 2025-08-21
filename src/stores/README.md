# Pinia Stores

This directory contains Pinia stores for managing application state.

## Colors Store

The `useColorsStore` manages color data fetched from Airtable. It provides centralized
state management for colors across the application.

### Features

- **Centralized State**: All color data is stored in one place
- **Caching**: Colors are cached and only fetched when needed
- **Batch Fetching**: Efficiently fetches colors in batches of 100
- **Error Handling**: Proper error handling with loading states
- **Reactive**: Fully reactive with Vue 3 Composition API

### Usage

#### Basic Usage

```typescript
import { useColorsStore } from '@/stores';

const colorsStore = useColorsStore();

// Fetch colors by IDs
await colorsStore.fetchColors(['rec123', 'rec456', 'rec789']);

// Get a specific color
const colorName = colorsStore.getColorById('rec123');

// Check if a color exists
const hasColor = colorsStore.hasColor('rec123');

// Get multiple colors
const colorList = colorsStore.getColorsByIds(['rec123', 'rec456']);
```

#### In Vue Components

```vue
<template>
    <div>
        <div v-if="colorsStore.isLoading">Loading...</div>
        <div v-if="colorsStore.error">Error: {{ colorsStore.error }}</div>

        <ul>
            <li v-for="(name, id) in colorsStore.colors" :key="id">
                {{ id }}: {{ name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useColorsStore } from '@/stores';

const colorsStore = useColorsStore();

// Fetch colors when component mounts
onMounted(async () => {
    await colorsStore.fetchColors(['rec123', 'rec456']);
});
</script>
```

#### Using the Composable

The `useColors` composable provides a simplified interface:

```typescript
import { useColors } from '@/composables/useColors';

const { fetchColors, colors, isLoading, error } = useColors();

await fetchColors(['rec123', 'rec456']);
```

### API Reference

#### State

- `colors`: Reactive object containing color data `{ [id]: name }`
- `isLoading`: Boolean indicating if colors are being fetched
- `error`: String containing error message if any

#### Getters

- `getColorById(id: string)`: Returns color name for given ID
- `getColorsByIds(ids: string[])`: Returns array of color objects with id and name
- `hasColor(id: string)`: Returns boolean indicating if color exists
- `missingColorIds(ids: string[])`: Returns array of IDs that don't have color data

#### Actions

- `fetchColors(ids: string[])`: Fetches colors for given IDs
- `fetchColorsForProducts(productIds: string[])`: Fetches colors for products
  (placeholder)
- `setColor(id: string, name: string)`: Sets a single color
- `setColors(colorMap: object)`: Sets multiple colors
- `clearColors()`: Clears all color data
- `clearError()`: Clears error state

### Migration from useColors Composable

The old `useColors` composable has been updated to use the Pinia store internally.
Existing code should continue to work without changes, but you can now also use the store
directly for more advanced features.

### Benefits

1. **Global State**: Colors are now shared across all components
2. **Performance**: Colors are cached and only fetched once
3. **Consistency**: All components use the same color data
4. **Debugging**: Pinia DevTools support for better debugging
5. **Type Safety**: Full TypeScript support
