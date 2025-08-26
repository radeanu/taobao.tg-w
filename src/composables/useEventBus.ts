import { ref, onUnmounted } from 'vue';

type EventHandler = (...args: unknown[]) => void;
type EventMap = Record<string, EventHandler[]>;

const eventBus = ref<EventMap>({});

export function useEventBus() {
    const listeners = ref<Map<string, EventHandler>>(new Map());

    function emit(event: string, ...data: unknown[]) {
        const handlers = eventBus.value[event];
        if (!handlers?.length) return;

        Promise.allSettled(
            handlers.map((handler) => {
                return new Promise((resolve, reject) => {
                    try {
                        handler(...data);
                        resolve(true);
                    } catch (error) {
                        console.error(`Error in event handler for ${event}:`, error);
                        reject(error);
                    }
                });
            })
        );
    }

    function on(event: string, handler: EventHandler) {
        if (!eventBus.value[event]) {
            eventBus.value[event] = [];
        }

        eventBus.value[event].push(handler);
        listeners.value.set(event, handler);
    }

    function once(event: string, handler: EventHandler) {
        const onceHandler = (...args: unknown[]) => {
            handler(...args);
            off(event, onceHandler);
        };
        on(event, onceHandler);
    }

    function off(event: string, handler: EventHandler) {
        const handlers = eventBus.value[event];
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
            if (handlers.length === 0) {
                delete eventBus.value[event];
            }
        }
        listeners.value.delete(event);
    }

    function offAll(event: string) {
        delete eventBus.value[event];
        listeners.value.delete(event);
    }

    function clear() {
        eventBus.value = {};
        listeners.value.clear();
    }

    function getEvents() {
        return Object.keys(eventBus.value);
    }

    function getListenerCount(event: string) {
        const handlers = eventBus.value[event];
        return handlers ? handlers.length : 0;
    }

    onUnmounted(() => {
        listeners.value.forEach((handler, event) => {
            off(event, handler);
        });
        listeners.value.clear();
    });

    return {
        emit,
        on,
        once,
        off,
        offAll,
        clear,
        getEvents,
        getListenerCount
    };
}
