import { ref, computed } from 'vue';
import { formatDateForInput, convertInputStringToDate } from '@/utils/date';

export const useDateInput = (initial: Date) => {
    const date = ref<Date>(initial);

    const inputValue = computed<string>(() => formatDateForInput(date.value));

    const setDate = (string: string) => {
        const newDate = convertInputStringToDate(string);
        if (newDate) date.value = newDate;
    }

    return {
        date,
        inputValue,
        setDate,
    };
}