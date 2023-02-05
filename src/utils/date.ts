import { pad } from "@/utils/number"

export const getTheTrueFortmatOfDate = (date: Date, includeTime: boolean = true): string => {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    let d = `${day}.${month}.${date.getFullYear()}`;
    if (!includeTime) return d;
    return `${d} - ${hours}:${minutes}`;
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

// Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
export const daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
}

export const getFirstDayInMonth = (date: Date): Date => {
    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-01`);
}

export const getLastDayInMonth = (date: Date): Date => {
    const lastDay = daysInMonth(date.getMonth() + 1, date.getFullYear());
    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${lastDay}`);
}

export const getMonday = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

export const getSunday = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(date.setDate(diff));
}

export const getSecondsFromTimeString = (time: string): number => {
    if (!isTimeStringValid(time)) return 0;
    const [hours, minutes] = time.split(':');
    const hoursInSeconds = +hours * 3600;
    const minutesInSeconds = +minutes * 60;
    return hoursInSeconds + minutesInSeconds;
}