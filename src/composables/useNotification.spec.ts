import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotification } from './useNotification';

// Mock DOM environment
const mockContainer = {
    appendChild: vi.fn(),
    remove: vi.fn()
};

const mockDocument = {
    createElement: vi.fn(() => mockContainer),
    body: {
        appendChild: vi.fn()
    }
};

// Mock Vue component
const mockComponent = {
    mount: vi.fn(),
    show: vi.fn(),
    hide: vi.fn()
};

// Mock ShNotification component
vi.mock('@/components/UI/ShNotification.vue', () => ({
    default: vi.fn(() => mockComponent)
}));

describe('useNotification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.document = mockDocument as any;
        global.window = {
            setInterval: vi.fn(() => 123),
            clearInterval: vi.fn()
        } as any;
    });

    it('should create notification with default options', () => {
        const notification = useNotification();

        notification.show('Test message');

        expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockContainer);
        expect(mockComponent.mount).toHaveBeenCalledWith(mockContainer);
        expect(mockComponent.show).toHaveBeenCalled();
    });

    it('should create notification with custom options', () => {
        const notification = useNotification();

        notification.show({
            type: 'error',
            message: 'Error message',
            timeout: 3000,
            title: 'Error Title'
        });

        expect(mockComponent.mount).toHaveBeenCalled();
        expect(mockComponent.show).toHaveBeenCalled();
    });

    it('should use convenience methods', () => {
        const notification = useNotification();

        notification.error('Error message');
        notification.warning('Warning message');
        notification.success('Success message');
        notification.info('Info message');

        expect(mockComponent.show).toHaveBeenCalledTimes(4);
    });

    it('should handle string input as message', () => {
        const notification = useNotification();

        notification.show('Simple message');

        expect(mockComponent.mount).toHaveBeenCalled();
        expect(mockComponent.show).toHaveBeenCalled();
    });
});
