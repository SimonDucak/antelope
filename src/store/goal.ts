import { AntelopeGoal } from './../model/AntelopeGoal';
import { defineStore } from 'pinia';
import {
    doc, setDoc, collection as getCollection,
} from 'firebase/firestore';
import { firestore } from '@/firebase';

export const useGoalStore = defineStore('goal', {
    state: (): {} => ({}),
    actions: {
        async archiveGoal(goal: AntelopeGoal, sectionId: string): Promise<void> {
            const collection = getCollection(firestore, 'sections', sectionId, 'archived-goals');
            const document = doc(collection, goal.id);
            await setDoc(document, goal.serialize());
        },
    }
});