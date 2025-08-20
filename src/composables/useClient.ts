import { computed } from 'vue';
import { CLIENT_MAP } from '@/common/model';
import { clientApi } from '@/composables/useAirtable';
import type { AirRecord, ClientInfo } from '@/common/types';

export function useClient() {
    const app = window.Telegram.WebApp;
    const user = app.initDataUnsafe?.user;

    const clientInfo = computed<ClientInfo>(() => {
        return {
            name:
                user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.first_name || 'Не указано',
            tg_id: user?.id || 800438908
        };
    });

    async function findOrCreateClient(): Promise<string | null> {
        try {
            const findRes = await clientApi.get('/', {
                params: {
                    filterByFormula: `{${CLIENT_MAP.tg_id}} = ${clientInfo.value.tg_id}`,
                    pageSize: 1
                }
            });

            const existingClient = findRes.data?.records?.[0];
            if (existingClient) {
                return existingClient.id;
            }

            const createRes = await clientApi.post('/', {
                fields: {
                    [CLIENT_MAP.name]: clientInfo.value.name,
                    [CLIENT_MAP.tg_id]: clientInfo.value.tg_id
                }
            });

            const newClient = createRes.data as AirRecord;
            if (!newClient.id) return null;

            return newClient.id;
        } catch (error) {
            console.error('Error finding/creating client:', error);
            return null;
        }
    }

    return {
        clientInfo,
        findOrCreateClient
    };
}
