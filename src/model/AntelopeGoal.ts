import { DocumentSnapshot } from 'firebase/firestore';
import { Deserializer } from '@/utils/deserializer';
import { isTimeStringValid } from './../utils/date';
import { pad } from "@/utils/number";
import { Day } from "./Day";
import { useAuth } from '@/composable/use_auth';
import { ObjectDeserializer } from '@/utils/objectDeserializer';

export class AntelopeGoal {
    private _id: string;
    get id() { return this._id; }

    private _ownerUid: string;
    get ownerUid() { return this._ownerUid; }

    private _time: string;
    get time() { return this._time; }
    set time(newTime: string) {
        if (!isTimeStringValid(newTime)) return;
        this._time = newTime;
    }

    private _days: Day[];
    get days() { return this._days; }
    set days(newDays: Day[]) {
        this._days = [...new Set(newDays)];
    }

    serialize(): { [key: string]: any } {
        return {
            id: this._id,
            ownerUid: this._ownerUid,
            time: this._time,
            days: this._days,
        };
    }

    static desrializeFromObject(object: { [key: string]: any }): AntelopeGoal {
        const deserializer = new ObjectDeserializer(object);
        return new AntelopeGoal(
            deserializer.getField<string>('time', ''),
            deserializer.getField<Day[]>('days', []),
            deserializer.getField<string>('id', ''),
        );
    }

    static deserializeFromDocSnapshot(document: DocumentSnapshot): AntelopeGoal {
        const deserializer = new Deserializer<AntelopeGoal>(document);
        return new AntelopeGoal(
            deserializer.getField<string>('time', ''),
            deserializer.getField<Day[]>('days', []),
            document.id,
        );
    }

    static getGoalId(date: Date): string {
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        return `${day}${month}${date.getFullYear()}`;
    }

    constructor(time: string, days: Day[], id?: string) {
        this._id = id ?? AntelopeGoal.getGoalId(new Date());
        const { currentUser } = useAuth();
        if (!currentUser) throw Error('User is not logged in');
        this._ownerUid = currentUser.uid;
        this._time = time;
        this._days = [...new Set(days)];
    }
}