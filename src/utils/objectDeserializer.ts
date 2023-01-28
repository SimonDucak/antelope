import { DocumentSnapshot } from 'firebase/firestore'
import { typeofObject } from '@/utils/typeof'

export class ObjectDeserializer {
    // ****************************************************
    // Properties / Getters / Setters
    // ****************************************************
    private _object: { [key: string]: any };
    get object(): { [key: string]: any } {
        return this._object
    }

    // ****************************************************
    // Methods
    // ****************************************************
    public fieldExists(key: string): boolean {
        if (typeofObject(this.object)) return this.object.hasOwnProperty(key)
        return false
    }

    public getField<K>(key: string, defaultValue: K): K {
        if (!this.fieldExists(key)) return defaultValue
        const fieldValue = this.object[key]
        if (typeof fieldValue != typeof defaultValue) return defaultValue
        return fieldValue
    }

    // ****************************************************
    // Constructor
    // ****************************************************
    constructor(object: { [key: string]: any }) {
        this._object = object
    }
}