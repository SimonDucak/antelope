export enum Day {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}

export interface DayOption {
    value: Day;
    label: string;
}

export const dayOptions: DayOption[] = [
    { value: Day.MONDAY, label: 'Monday' },
    { value: Day.TUESDAY, label: 'Tuesday' },
    { value: Day.WEDNESDAY, label: 'Wednesday' },
    { value: Day.THURSDAY, label: 'Thursday' },
    { value: Day.FRIDAY, label: 'Friday' },
    { value: Day.SATURDAY, label: 'Saturday' },
    { value: Day.SUNDAY, label: 'Sunday' }
];