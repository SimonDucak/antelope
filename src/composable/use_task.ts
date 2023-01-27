import { ref } from "vue";

export type PerformFn<T> = (...args: any[]) => Promise<T>;

export const useTask = <T = void>(fn: PerformFn<T>) => {
    const isRunning = ref<boolean>(false);

    const perform = async (...args: any[]): Promise<T> => {
        try {
            isRunning.value = true;
            const result = await fn(...args);
            return result;
        } catch (err) {
            throw err;
        } finally {
            isRunning.value = false;
        }
    };

    return {
        isRunning,
        perform,
    };
}