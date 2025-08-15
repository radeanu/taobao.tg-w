<template>
    <div v-modal-teleport class="modal-overlay">
        <div class="modal-wrapper" :class="align" @click.self="handleClose">
            <div ref="modalContent" class="modal-content">
                <slot />

                <ShButton
                    v-if="closeBtn"
                    icon-left="close"
                    kind="unstyled"
                    class="btn-close"
                    @click="emits('close')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, useTemplateRef } from 'vue';

import { ShButton } from '@UI';

export type ShModalT = {
    closeOnBlur?: boolean;
    closeBtn?: boolean;
    align?: 'center' | 'top';
};

const props = withDefaults(defineProps<ShModalT>(), {
    closeOnBlur: true,
    align: 'center'
});

const emits = defineEmits(['close']);
const modalContent = useTemplateRef('modalContent');
const overflowNode = document.getElementById('app');
const overflowPos = ref(0);

onBeforeMount(() => {
    togglePageOverflow(false);
});

onBeforeUnmount(() => {
    togglePageOverflow(true);
});

function handleClose() {
    if (props.closeOnBlur) {
        emits('close');
        return;
    }

    if (!modalContent.value) return;

    modalContent.value.style.transform = 'scale(1.05)';
    modalContent.value.style.transition = 'transform 0.2s ease-in-out';
    modalContent.value.addEventListener(
        'transitionend',
        () => {
            if (!modalContent.value) return;
            modalContent.value.style.transform = 'scale(1)';
        },
        { once: true }
    );
}

function togglePageOverflow(display: boolean) {
    if (!overflowNode) return;

    overflowNode.style.overflowX = 'clip';

    if (!display) {
        overflowPos.value = window.pageYOffset || document.documentElement.scrollTop;
        // overflowNode.style.overflowY = 'hidden';

        overflowNode.style.position = 'fixed';
        overflowNode.style.top = `-${overflowPos.value}px`;
    } else {
        overflowNode.style.overflowY = '';
        overflowNode.style.position = '';
        overflowNode.style.top = '';

        window.scrollTo({
            top: overflowPos.value,
            left: 0,
            behavior: 'instant'
        });
    }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    position: absolute;
    z-index: var(--z-index-modal);
    background: var(--color-grey3);
}

.modal-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 50px;
    padding-inline: var(--layout-pad-x);
    overflow-y: auto;
    overflow-x: hidden;

    &.top {
        align-items: baseline;
    }

    &.center {
        align-items: center;
    }
}

.modal-content {
    transform: scale(1);
    animation-name: modalOpen;
    animation-duration: 0.3s;
    position: relative;
    border-radius: var(--border-radius-m);
    background: var(--color-white);
    padding: 30px;
    margin-inline: auto;
    width: var(--modal-width, 100%);
    height: var(--modal-height, fit-content);
    max-width: var(--modal-max-width, var(--layout-max-width));
}

.btn-close {
    top: 0;
    width: 32px;
    height: 32px;
    right: -42px;
    border-radius: 4px;
    position: absolute;
    color: var(--color-white);
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    --icon-width: 14px;
    --icon-height: 14px;
    --icon-color: var(--color-grey2);

    &:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
}

@keyframes modalOpen {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
