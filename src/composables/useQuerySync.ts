import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useQuerySync<T extends string | null>(
    queryKey: string,
    defaultValue: T = null as T
) {
    const route = useRoute();
    const router = useRouter();
    const queryVal = ref<T>(defaultValue);

    watch(
        () => route.query[queryKey],
        (v) => {
            queryVal.value = v ? (v as T) : defaultValue;
        },
        { immediate: true }
    );

    watch(queryVal, (v) => {
        if (v && route.query[queryKey] !== v) {
            router.replace({
                query: { ...route.query, [queryKey]: v }
            });

            return;
        }

        if (!v && route.query[queryKey]) {
            const { [queryKey]: _, ...restQuery } = route.query;
            router.replace({ query: restQuery });
        }
    });

    return {
        queryVal
    };
}
