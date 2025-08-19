export function useStorage() {
    const app = window?.Telegram?.WebApp;
    const userId = app?.initDataUnsafe?.user?.id?.toString();
    const tgStorage = app?.CloudStorage;

    const isTelegram = Boolean(userId && tgStorage);

    function getItem(key: string): Promise<string | null> {
        if (isTelegram) {
            return new Promise((resolve) => {
                tgStorage.getItem(key, (error, value) => {
                    if (error) {
                        console.log(error);
                        return resolve(null);
                    }
                    resolve(value ?? null);
                });
            });
        }

        try {
            const value = window.localStorage.getItem(key);
            return Promise.resolve(value);
        } catch (_) {
            return Promise.resolve(null);
        }
    }

    function setItem(key: string, value: string): Promise<boolean> {
        if (isTelegram) {
            return new Promise((resolve) => {
                tgStorage.setItem(key, value, (error, success) => {
                    resolve(!error && !!success);
                });
            });
        }

        try {
            window.localStorage.setItem(key, value);
            return Promise.resolve(true);
        } catch (_) {
            return Promise.resolve(false);
        }
    }

    return { getItem, setItem, isTelegram };
}
