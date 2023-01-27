import { DocumentSnapshot } from 'firebase/firestore'
import { typeofObject } from '@/utils/typeof'

export class Deserializer<T> {
    // ****************************************************
    // Properties / Getters / Setters
    // ****************************************************
    private _document: DocumentSnapshot
    get document(): DocumentSnapshot {
        return this._document
    }

    get data(): any {
        return this._document.data()
    }

    // ****************************************************
    // Methods
    // ****************************************************
    public fieldExists(key: keyof T): boolean {
        if (typeofObject(this.data)) return this.data.hasOwnProperty(key)
        return false
    }

    public getField<K>(key: keyof T, defaultValue: K): K {
        if (!this.document.exists || !this.fieldExists(key)) return defaultValue
        const fieldValue = this.data[key]
        if (typeof fieldValue != typeof defaultValue) return defaultValue
        return fieldValue
    }

    // ****************************************************
    // Constructor
    // ****************************************************
    constructor(document: DocumentSnapshot) {
        this._document = document
    }
}