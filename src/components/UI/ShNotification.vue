<template>
    <Transition name="notification" appear>
        <div
            v-if="isVisible"
            :class="[
                'sh-notification',
                `sh-notification--${type}`,
                { 'sh-notification--with-icon': showIcon }
            ]"
            :style="{ '--notification-z-index': zIndex }"
        >
            <div class="sh-notification__content">
                <ShIcon
                    v-if="showIcon && showIconComponent"
                    :name="iconName"
                    class="sh-notification__icon"
                />
                <span v-else-if="showIcon" class="sh-notification__icon-text">
                    {{ iconName }}
                </span>
                <div class="sh-notification__text">
                    <div v-if="title" class="sh-notification__title">{{ title }}</div>
                    <div class="sh-notification__message">{{ message }}</div>
                </div>
                <button
                    v-if="showCloseButton"
                    class="sh-notification__close"
                    @click="handleClose"
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
            <div
                v-if="showProgress"
                class="sh-notification__progress"
                :style="{ '--progress-width': `${progress}%` }"
            />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import ShIcon from './ShIcon.vue';

export interface NotificationProps {
    type?: 'error' | 'info' | 'warning' | 'success';
    title?: string;
    message: string;
    timeout?: number;
    showIcon?: boolean;
    showCloseButton?: boolean;
    showProgress?: boolean;
    zIndex?: number;
}

const props = withDefaults(defineProps<NotificationProps>(), {
    type: 'info',
    timeout: 5000,
    showIcon: true,
    showCloseButton: true,
    showProgress: true,
    zIndex: 1000
});

const emit = defineEmits<{
    close: [];
}>();

const isVisible = ref(false);
const progress = ref(100);
const progressInterval = ref<number | null>(null);

const iconName = computed(() => {
    switch (props.type) {
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        case 'success':
            return '✅';
        case 'info':
        default:
            return 'ℹ️';
    }
});

const showIconComponent = computed(() => {
    // For now, use text-based icons since the icon system isn't fully set up
    return false;
});

// Expose methods
defineExpose({
    show,
    hide
});

// Cleanup on unmount
watch(isVisible, (visible) => {
    if (!visible) {
        stopProgress();
    }
});

onMounted(() => {
    show();
});

function handleClose() {
    isVisible.value = false;
    emit('close');
}

function startProgress() {
    if (!props.showProgress || props.timeout <= 0) return;

    const startTime = Date.now();
    const endTime = startTime + props.timeout;

    progressInterval.value = window.setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const remaining = Math.max(0, endTime - currentTime);

        progress.value = (remaining / props.timeout) * 100;

        if (remaining <= 0) {
            handleClose();
        }
    }, 16); // ~60fps
}

function stopProgress() {
    if (progressInterval.value) {
        clearInterval(progressInterval.value);
        progressInterval.value = null;
    }
}

function show() {
    isVisible.value = true;
    progress.value = 100;
    startProgress();
}

function hide() {
    isVisible.value = false;
    stopProgress();
}
</script>

<style lang="scss" scoped>
.sh-notification {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--notification-z-index, 1000);
    max-width: calc(100vw - 2 * var(--layout-pad-x, 16px));
    width: 100%;
    max-width: 400px;
    background: var(--color-white);
    border-radius: var(--border-radius, 8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid transparent;
    overflow: hidden;

    &__content {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        gap: 12px;
    }

    &__icon {
        flex-shrink: 0;
        margin-top: 2px;
    }

    &__icon-text {
        flex-shrink: 0;
        font-size: 18px;
        line-height: 1;
        margin-top: 2px;
    }

    &__text {
        flex: 1;
        min-width: 0;
    }

    &__title {
        font-weight: 600;
        font-size: 14px;
        line-height: 1.4;
        margin-bottom: 4px;
        color: var(--color-black);
    }

    &__message {
        font-size: 14px;
        line-height: 1.4;
        color: var(--color-grey1);
    }

    &__close {
        flex-shrink: 0;
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: var(--border-radius-s, 4px);
        color: var(--color-grey1);
        transition: all 0.2s ease;

        &:hover {
            background: var(--color-grey4);
            color: var(--color-black);
        }
    }

    &__progress {
        height: 3px;
        background: var(--color-grey2);
        position: relative;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: var(--progress-width, 100%);
            background: currentColor;
            transition: width 0.1s linear;
        }
    }

    // Type variants
    &--error {
        border-color: var(--color-red);
        color: var(--color-red);

        .sh-notification__progress::after {
            background: var(--color-red);
        }
    }

    &--warning {
        border-color: var(--color-orange);
        color: var(--color-orange);

        .sh-notification__progress::after {
            background: var(--color-orange);
        }
    }

    &--success {
        border-color: #4caf50;
        color: #4caf50;

        .sh-notification__progress::after {
            background: #4caf50;
        }
    }

    &--info {
        border-color: #2196f3;
        color: #2196f3;

        .sh-notification__progress::after {
            background: #2196f3;
        }
    }

    // Without icon variant
    &--with-icon {
        .sh-notification__content {
            padding-left: 16px;
        }
    }

    &:not(.sh-notification--with-icon) {
        .sh-notification__content {
            padding-left: 16px;
        }
    }
}

// Transition animations
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}
</style>
