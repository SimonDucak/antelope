import { AntelopeGoal } from '@/model/AntelopeGoal';
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

    private _goals?: AntelopeGoal;
    get goals() { return this._goals; }
    set goals(newGoals: AntelopeGoal | undefined) {
        this._goals = newGoals;
    }

    private _isArchived: boolean;
    get isArchived() { return this._isArchived; }

    serialize(): { [key: string]: any } {
        return {
            id: this._id,
            createdAt: this._createdAt,
            ownerUid: this._ownerUid,
            name: this._name,
            icon: this._icon,
            goals: this._goals?.serialize(),
            isArchived: this._isArchived,
        };
    }

    static deserializeFromDocSnapshot(document: DocumentSnapshot): AntelopeSection {
        const deserializer = new Deserializer<AntelopeSection>(document);
        const data = document.data();
        const goals = data?.goals ? AntelopeGoal.desrializeFromObject(data.goals) : undefined;
        return new AntelopeSection(
            deserializer.getField<string>('name', ''),
            deserializer.getField<number>('createdAt', new Date().getTime()),
            deserializer.getField<string>('icon', ''),
            document.id,
            goals,
            deserializer.getField<boolean>('isArchived', false),
        );
    }

    static duplicateSection(section: AntelopeSection): AntelopeSection {
        return new AntelopeSection(section.name, new Date().getTime(), section.icon, section.id, section.goals);
    }

    static emptySection(): AntelopeSection {
        return new AntelopeSection('', new Date().getTime());
    }

    constructor(name: string, createdAt: number, icon?: string, id?: string, goals?: AntelopeGoal, isArchived?: boolean) {
        this._id = id ?? v1();
        const { currentUser } = useAuth();
        if (!currentUser) throw Error('User is not logged in');
        this._ownerUid = currentUser.uid;
        this._name = name;
        this._createdAt = createdAt;
        this._goals = goals;
        if (icon) this._icon = icon;
        this._isArchived = isArchived ?? false;
    }
}