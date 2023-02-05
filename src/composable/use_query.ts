import { computed, ComputedRef } from "vue";
import { useRouter } from "vue-router";

export const useQuery = () => {
    const { currentRoute } = useRouter();

    const getStringQueryParam = (key: string): ComputedRef<string> => {
        return computed<string>(() => {
            const param = currentRoute.value.query[key];
            if (!param || typeof param !== "string") return "";
            return param;
        })
    }

    return {
        getStringQueryParam,
    }
}