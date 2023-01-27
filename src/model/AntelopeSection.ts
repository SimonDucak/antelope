import { useAuth } from '@/composable/use_auth';
import { Deserializer } from './../utils/deserializer';
import { isValidDate } from "@/utils/date";
import { DocumentSnapshot } from "firebase/firestore";
import { v1 } from 'uuid';

export class AntelopeSection {
    private _id: string;
    get id() { return this._id; }

    private _ownerUid: string;
    get ownerUid() { return this._ownerUid; }

    private _createdAt: number;
    set createdAt(value: Date) {
        if (!isValidDate(value)) return;
        this._createdAt = value.getTime();
    }
    get createdAt() { return new Date(this._createdAt); }

    private _name: string;
    get name() { return this._name; };
    set name(value: string) { this._name = value.trim(); }

    private _icon: string = "";
    get icon() { return this._icon; }
    set icon(value: string) { this._icon = value.trim(); }

    serialize(): { [key: string]: any } {
        return {
            id: this._id,
            createdAt: this._createdAt,
            ownerUid: this._ownerUid,
            name: this._name,
            icon: this._icon,
        };
    }

    static deserializeFromDocSnapshot(document: DocumentSnapshot): AntelopeSection {
        const deserializer = new Deserializer<AntelopeSection>(document);
        return new AntelopeSection(
            deserializer.getField<string>('name', ''),
            deserializer.getField<number>('createdAt', new Date().getTime()),
            deserializer.getField<string>('icon', ''),
            document.id
        );
    }

    static emptySection(): AntelopeSection {
        return new AntelopeSection('', new Date().getTime());
    }

    constructor(name: string, createdAt: number, icon?: string, id?: string) {
        this._id = id ?? v1();
        const { currentUser } = useAuth();
        if (!currentUser) throw Error('User is not logged in');
        this._ownerUid = currentUser.uid;
        this._name = name;
        this._createdAt = createdAt;
        if (icon) this._icon = icon;
    }
}