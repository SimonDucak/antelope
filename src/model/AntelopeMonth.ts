import { DocumentSnapshot } from 'firebase/firestore';
import { Deserializer } from '@/utils/deserializer';
import { useAuth } from '@/composable/use_auth';
import { AntelopeRange } from '@/model/AntelopeRange';
import { pad } from '@/utils/number';

export class AntelopeMonth {
    private _id: string;
    get id() { return this._id; }

    private _ownerUid: string;
    get ownerUid() { return this._ownerUid; }

    private _ranges: AntelopeRange[];
    get ranges(): AntelopeRange[] { return this._ranges; }
    set ranges(value: AntelopeRange[]) { this._ranges = value; }

    serialize(): { [key: string]: any } {
        return {
            id: this._id,
            ownerUid: this._ownerUid,
            ranges: this._ranges.map(range => range.serialize()),
        };
    }

    static deserializeFromDocSnapshot(document: DocumentSnapshot): AntelopeMonth {
        const deserializer = new Deserializer<AntelopeMonth>(document);
        if (!deserializer.fieldExists('ranges')) throw Error('No ranges field in document');
        const ranges: AntelopeRange[] = (document.data()!['ranges'] as unknown as { [key: string]: any }[])
            .map(range => AntelopeRange.deserialize(range));
        return new AntelopeMonth(ranges, document.id);
    }

    static getMonthId(date: Date): string {
        const month = pad(date.getMonth() + 1);
        return `${month}${date.getFullYear()}`;
    }

    static emptyMonth(id: string): AntelopeMonth {
        return new AntelopeMonth([], id);
    }

    constructor(ranges: AntelopeRange[], id?: string) {
        this._id = id ?? AntelopeMonth.getMonthId(new Date());
        const { currentUser } = useAuth();
        if (!currentUser) throw Error('User is not logged in');
        this._ownerUid = currentUser.uid;
        this._ranges = ranges;
    }
}