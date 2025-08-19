import { describe, it, expect, vi } from 'vitest';
import { useStorage } from './useStorage';

describe('useStorage', () => {
    it('should use localStorage when Telegram is not available', async () => {
        const { getItem, setItem, isTelegram } = useStorage();

        expect(isTelegram).toBe(false);

        await setItem('testKey', 'testValue');
        const value = await getItem('testKey');
        expect(value).toBe('testValue');
    });

    it('should use Telegram CloudStorage when available', async () => {
        const mockTgStorage = {
            getItem: vi.fn((key, callback) => callback(null, 'tgValue')),
            setItem: vi.fn((key, value, callback) => callback(null, true))
        };

        Object.defineProperty(window, 'Telegram', {
            value: {
                WebApp: {
                    initDataUnsafe: {
                        user: {
                            id: '123'
                        }
                    },
                    CloudStorage: mockTgStorage
                }
            },
            writable: true
        });

        const { getItem, setItem, isTelegram } = useStorage();

        expect(isTelegram).toBe(true);

        await setItem('testKey', 'testValue');
        expect(mockTgStorage.setItem).toHaveBeenCalledWith(
            'testKey',
            'testValue',
            expect.any(Function)
        );

        const value = await getItem('testKey');
        expect(mockTgStorage.getItem).toHaveBeenCalledWith(
            'testKey',
            expect.any(Function)
        );
        expect(value).toBe('tgValue');
    });
});
