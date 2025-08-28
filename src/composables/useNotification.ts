import { ref, shallowRef, readonly, createApp, h } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import ShNotification from '@/components/UI/ShNotification.vue';

export interface NotificationOptions {
    type?: 'error' | 'info' | 'warning' | 'success';
    title?: string;
    message: string;
    timeout?: number;
    showIcon?: boolean;
    showCloseButton?: boolean;
    showProgress?: boolean;
    zIndex?: number;
}

export interface NotificationInstance extends ComponentPublicInstance {
    show: () => void;
    hide: () => void;
}

const notificationInstance = shallowRef<NotificationInstance | null>(null);
const isVisible = ref(false);

export function useNotification() {
    function show(options: NotificationOptions | string) {
        // If options is a string, treat it as message
        const notificationOptions: NotificationOptions =
            typeof options === 'string' ? { message: options } : options;

        // Default options
        const defaultOptions: NotificationOptions = {
            type: 'info',
            timeout: 2000,
            showIcon: true,
            showCloseButton: true,
            showProgress: true,
            zIndex: 999999,
            message: ''
        };

        const finalOptions = { ...defaultOptions, ...notificationOptions };

        // If notification is already visible, hide it first
        if (isVisible.value && notificationInstance.value) {
            notificationInstance.value.hide();
        }

        // Create new notification instance using h() function
        const notificationComponent = h(ShNotification, {
            ...finalOptions,
            onClose: () => {
                isVisible.value = false;
                notificationInstance.value = null;
            }
        });

        // Mount the notification
        const container = document.createElement('div');
        document.body.appendChild(container);
        const app = createApp(notificationComponent);
        const mountedInstance = app.mount(container);

        // Store reference and show
        notificationInstance.value = mountedInstance as NotificationInstance;
        isVisible.value = true;
        notificationInstance.value.show();

        return notificationInstance.value;
    }

    function hide() {
        if (notificationInstance.value) {
            notificationInstance.value.hide();
        }
    }

    // Convenience methods for different notification types
    function error(message: string, options?: Partial<NotificationOptions>) {
        return show({ type: 'error', message, ...options });
    }

    function warning(message: string, options?: Partial<NotificationOptions>) {
        return show({ type: 'warning', message, ...options });
    }

    function success(message: string, options?: Partial<NotificationOptions>) {
        return show({ type: 'success', message, ...options });
    }

    function info(message: string, options?: Partial<NotificationOptions>) {
        return show({ type: 'info', message, ...options });
    }

    return {
        show,
        hide,
        error,
        warning,
        success,
        info,
        isVisible: readonly(isVisible)
    };
}

// Global notification instance
let globalNotification: ReturnType<typeof useNotification> | null = null;

export function useGlobalNotification() {
    if (!globalNotification) {
        globalNotification = useNotification();
    }
    return globalNotification;
}
