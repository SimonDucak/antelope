import { AntelopeMonth } from '@/model/AntelopeMonth';
import { getSecondsBetweenTwoDates, isValidDate } from "@/utils/date";
import { formatSecondsToHhmmss } from "@/utils/number";
import { ObjectDeserializer } from "@/utils/objectDeserializer";
import { v1 } from "uuid";

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

    get monthId() { return AntelopeMonth.getMonthId(this.startDate); }

    serialize(): { [key: string]: any } {
        return {
            id: this._id,
            startDate: this._startDate,
            endDate: this._endDate,
        };
    }

    static deserialize(obj: { [key: string]: any }): AntelopeRange {
        const objectDeserializer = new ObjectDeserializer(obj);
        return new AntelopeRange(
            objectDeserializer.getField<number>('startDate', new Date().getTime()),
            objectDeserializer.getField<number>('endDate', new Date().getTime()),
            objectDeserializer.getField<string>('id', v1())
        );
    };

    static emptyRange(): AntelopeRange {
        return new AntelopeRange(new Date().getTime(), new Date().getTime());
    }

    constructor(startDate: number, endDate: number, id?: string) {
        this._id = id ?? v1();
        this._startDate = startDate;
        this._endDate = endDate;
    }
}