import { getSecondsBetweenTwoDates, isValidDate } from "@/utils/date";
import { formatSecondsToHhmmss } from "@/utils/number";

export class AntelopeRange {
    private _id: string;
    get id() { return this._id; }

    private _startDate: number;
    set startDate(value: Date) {
        if (!isValidDate(value)) return;
        this._startDate = value.getTime();
    }
    get startDate() { return new Date(this._startDate); }

    private _endDate: number;
    set endDate(value: Date) {
        if (!isValidDate(value)) return;
        this._endDate = value.getTime();
    }
    get endDate() { return new Date(this._endDate); }

    get secondsDiff() { return getSecondsBetweenTwoDates(this.startDate, this.endDate); }

    get hhmmss() { return formatSecondsToHhmmss(this.secondsDiff); }

    constructor(id: string, startDate: Date, endDate: Date) {
        this._id = id;
        this._startDate = startDate.getTime();
        this._endDate = endDate.getTime();
    }
}