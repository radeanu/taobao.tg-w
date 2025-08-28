import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

import { useLoading } from '@/composables/useLoading';
import { useStorage } from '@/composables/useStorage';
import { useGlobalNotification } from '@/composables/useNotification';

export const useFavoritesStore = defineStore('favorites', () => {
    const loading = useLoading();
    const storage = useStorage();
    const notification = useGlobalNotification();

    const favorites = ref<string[]>([]);

    onMounted(async () => {
        await fetchFavorites();
    });

    function _submitFavorites() {
        return storage.setItem(
            'favorites',
            JSON.stringify({ favorites: favorites.value })
        );
    }

    function addToFavorites(pId: string) {
        if (favorites.value.includes(pId)) return;

        favorites.value.push(pId);
        return _submitFavorites();
    }

    function removeFromFavorites(pId: string) {
        favorites.value = favorites.value.filter((id) => id !== pId);
        return _submitFavorites();
    }

    function toggleFavorite(pId: string) {
        return favorites.value.includes(pId)
            ? removeFromFavorites(pId)
            : addToFavorites(pId);
    }

    function isFavorite(pId: string): boolean {
        return favorites.value.includes(pId);
    }

    function clearFavorites() {
        favorites.value = [];
        return _submitFavorites();
    }

    async function fetchFavorites() {
        try {
            loading.start();
            const data = await storage.getItem('favorites');
            if (!data) return;

            const parsed = JSON.parse(data) as { favorites: string[] };
            favorites.value = parsed.favorites ?? [];
        } catch (e) {
            console.error(e);
            notification.error('Не удалось получить избранные');
        } finally {
            loading.end();
        }
    }

    return {
        loading,
        favorites,
        isFavorite,
        addToFavorites,
        toggleFavorite,
        fetchFavorites,
        clearFavorites,
        removeFromFavorites
    };
});
