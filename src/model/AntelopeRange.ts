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
            objectDeserializer.getField<Date>('startDate', new Date()),
            objectDeserializer.getField<Date>('endDate', new Date()),
            objectDeserializer.getField<string>('id', v1())
        );
    };

    static emptyRange(): AntelopeRange {
        return new AntelopeRange(new Date(), new Date());
    }

    constructor(startDate: Date, endDate: Date, id?: string) {
        this._id = id ?? v1();
        this._startDate = startDate.getTime();
        this._endDate = endDate.getTime();
    }
}