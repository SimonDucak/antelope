export const pad = (num: number): string => {
    if (num <= 9) return `0${num}`;
    return num.toString();
}

export const formatSecondsToHhmmss = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const restSeconds = totalSeconds %= 3600;
    const minutes = Math.floor(restSeconds / 60);
    const seconds = Math.floor(restSeconds % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}