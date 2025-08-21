<template>
    <div class="image-slideshow">
        <div class="main-image-container">
            <ShImage
                :src="getImageUrl(currentImage, 'large')"
                class="main-image"
                :alt="(currentImage as any)?.alt || `Image ${currentIndex + 1}`"
            />

            <ShButton
                v-if="images.length > 1"
                @click="previous"
                class="nav-btn prev-btn"
                kind="unstyled"
                aria-label="Previous image"
            >
                ◀
            </ShButton>

            <ShButton
                v-if="images.length > 1"
                @click="next"
                class="nav-btn next-btn"
                kind="unstyled"
                aria-label="Next image"
            >
                ▶
            </ShButton>

            <div v-if="images.length > 1" class="image-counter">
                {{ currentIndex + 1 }} / {{ images.length }}
            </div>
        </div>

        <div v-if="images.length > 1" class="thumbnails-container">
            <div class="thumbnails-wrapper">
                <div
                    v-for="(image, index) in images"
                    :key="index"
                    class="thumbnail-item"
                    :class="{ active: index === currentIndex }"
                    @click="goToImage(index)"
                >
                    <ShImage
                        :src="getImageUrl(image, 'small')"
                        class="thumbnail-image"
                        :alt="(image as any)?.alt || `Thumbnail ${index + 1}`"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends AirImage">
import { ref, computed, watch } from 'vue';

import type { AirImage } from '@/common/types';

import ShImage from './ShImage.vue';
import ShButton from './ShButton.vue';

interface Props {
    images: T[];
    initialIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    initialIndex: 0
});

const currentIndex = ref(props.initialIndex);

const currentImage = computed(() => props.images[currentIndex.value]);

watch(
    () => props.initialIndex,
    (newIndex) => {
        currentIndex.value = newIndex;
    }
);

function getImageUrl(image: AirImage, size: 'small' | 'large' = 'large'): string {
    if (!image) return '';

    if (image.thumbnails?.[size]?.url) {
        return image.thumbnails[size].url;
    }

    if (image.thumbnails?.large?.url) {
        return image.thumbnails.large.url;
    }

    if (image.thumbnails?.small?.url) {
        return image.thumbnails.small.url;
    }

    if (image.url) {
        return image.url;
    }

    return '';
}

function next() {
    if (props.images.length <= 1) return;
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
}

function previous() {
    if (props.images.length <= 1) return;
    currentIndex.value =
        currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
}

function goToImage(index: number) {
    if (index < 0 || index >= props.images.length) return;
    currentIndex.value = index;
}
</script>

<style lang="scss" scoped>
.image-slideshow {
    width: 100%;
}

.main-image-container {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: var(--border-radius-m);
    background: var(--tg-secondary-bg-color, var(--color-white));
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    z-index: var(--z-index-dropdown);

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }

    &.prev-btn {
        left: 10px;
    }

    &.next-btn {
        right: 10px;
    }
}

.image-counter {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    z-index: var(--z-index-dropdown);
}

.thumbnails-container {
    padding: 10px;
    background: var(--tg-secondary-bg-color, var(--color-white));
    border-radius: 0 0 var(--border-radius-m) var(--border-radius-m);
}

.thumbnails-wrapper {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--tg-hint-color, var(--color-grey4)) transparent;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--tg-hint-color, var(--color-grey4));
        border-radius: 2px;
    }
}

.thumbnail-item {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;

    &.active {
        border-color: var(--tg-button-color, var(--color-primary));
    }

    &:hover {
        border-color: var(--tg-hint-color, var(--color-grey4));
    }
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (max-width: 768px) {
    .main-image-container {
        height: 300px;
    }

    .nav-btn {
        width: 35px;
        height: 35px;
        font-size: 14px;
    }

    .thumbnail-item {
        width: 50px;
        height: 50px;
    }
}
</style>
