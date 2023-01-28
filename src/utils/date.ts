import { pad } from "@/utils/number"

export const getTheTrueFortmatOfDate = (date: Date): string => {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}.${month}.${date.getFullYear()} - ${hours}:${minutes}`;
}

export const getSecondsBetweenTwoDates = (dateA: Date, dateB: Date): number => {
    const dif = dateA.getTime() - dateB.getTime();
    const Seconds_from_T1_to_T2 = dif / 1000;
    return Math.abs(Seconds_from_T1_to_T2);
}

export const formatDateForInput = (date: Date): string => {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    return `${date.getFullYear()}-${month}-${day}`;
}

export const isValidDate = (date: Date): boolean => {
    return !isNaN(date.getMonth());
}

export const isTimeStringValid = (string: string): boolean => {
    const regex = /[0-9]{2}:[0-9]{2}/;
    if (!regex.test(string)) return false;
    const [hours, minutes] = string.split(':');
    return +hours < 24 && +minutes < 60;
}

export const convertInputStringToDate = (string: string): Date | null => {
    const regex = /[0-9]-[0-9]{2}-[0-9]{2}/;
    if (!regex.test(string)) return null;
    const date = new Date(string);
    return isValidDate(date) ? date : null;
}