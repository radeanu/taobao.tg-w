<template>
    <div class="app-image container-inherit" role="none">
        <ShSkeleton v-if="!imageLoaded" />

        <div
            v-if="preview"
            role="button"
            class="preview-btn container-inherit"
            @click="openPreview = true"
        >
            <ShIcon name="eye-close" />
        </div>

        <div ref="wrapperNode" class="image-background container-inherit"></div>

        <img
            ref="imgNode"
            class="image container-inherit"
            :loading="props.lazy ? 'lazy' : 'eager'"
            decoding="async"
            @load="handleLoad"
            @error.once="handleError"
        />

        <ShModal v-if="openPreview" @close="openPreview = false">
            <div class="container-preview">
                <ShImage
                    class="container-preview__image"
                    :src="imageSrc"
                    lazy
                    fit="contain"
                />
            </div>
        </ShModal>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from 'vue';

import ShIcon from './ShIcon.vue';
import ShModal from './ShModal.vue';
import ShSkeleton from './ShSkeleton.vue';

export type ShImageT = {
    src?: string;
    lazy?: boolean;
    preview?: boolean;
    defaultImage?: string;
    fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
};

const props = withDefaults(defineProps<ShImageT>(), {
    fit: 'contain',
    defaultImage: '/images/default.png'
});

const imageLoaded = ref(false);
const openPreview = ref(false);
const imageSrc = ref<string>('');
const imgNode = useTemplateRef('imgNode');
const wrapperNode = useTemplateRef('wrapperNode');

watchEffect(() => {
    imageSrc.value = props?.src?.length ? props.src : props.defaultImage;
});

watchEffect(() => {
    if (!imgNode.value || !wrapperNode.value) return;
    imgNode.value.src = imageSrc.value;

    wrapperNode.value.style.filter = 'blur(5px)';
    wrapperNode.value.style.backgroundRepeat = 'no-repeat';
    wrapperNode.value.style.backgroundImage = `url(${imageSrc.value})`;
});

function handleError() {
    if (!imgNode.value) return;

    if (imgNode.value.src?.includes(props.defaultImage)) {
        imageLoaded.value = true;
        return;
    }

    imageSrc.value = props.defaultImage;
}

function handleLoad() {
    imageLoaded.value = true;
}
</script>

<style lang="scss" scoped>
.app-image {
    display: block;
    position: relative;

    &:hover {
        .preview-btn {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.container-inherit {
    width: inherit;
    height: inherit;
    min-width: inherit;
    min-height: inherit;
    max-width: inherit;
    max-height: inherit;
    border-radius: inherit;
}

.image-background {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    background-position: center;
}

.image {
    position: relative;
    overflow: hidden;
    object-fit: v-bind(fit);
    object-position: center;
}

.preview-btn {
    width: inherit;
    height: inherit;
    border-radius: inherit;
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: var(--z-index);

    --icon-width: 26px;
    --icon-height: 26px;
    --icon-color: var(--color-white);
}

.container-preview {
    margin: auto;
    min-width: 100px;
    min-height: 200px;
    max-height: 100vh;
    max-height: 100dvh;

    &__image {
        width: 100%;
        margin: auto;
    }
}
</style>
