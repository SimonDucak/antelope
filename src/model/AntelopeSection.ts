import { isValidDate } from "@/utils/date";

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

    constructor(id: string, ownerUid: string, name: string, createdAt: number, icon?: string) {
        this._id = id;
        this._ownerUid = ownerUid;
        this._name = name;
        this._createdAt = createdAt;
        if (icon) this._icon = icon;
    }
}