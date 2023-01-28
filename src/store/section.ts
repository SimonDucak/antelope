import { useGoalStore } from '@/store/goal';
import { firestore } from '@/firebase';
import { AntelopeSection } from '@/model/AntelopeSection';
import { defineStore } from 'pinia'
import { useAuth } from '@/composable/use_auth'
import {
  collection, CollectionReference,
  Query, where, query, getDocs, doc, setDoc,
  deleteDoc, DocumentReference, updateDoc,
} from 'firebase/firestore';

export const useSectionStore = defineStore('section', {
  state: (): { sections: AntelopeSection[] } => ({
    sections: []
  }),
  actions: {
    getCollection(): CollectionReference {
      return collection(firestore, 'sections');
    },
    getDocument(id: string): DocumentReference {
      return doc(this.getCollection(), id);
    },
    getCurrentUserSectionsQuery(): Query | null {
      const { currentUser } = useAuth();
      if (!currentUser) return null;
      return query(
        this.getCollection(),
        where('ownerUid', '==', currentUser.uid),
        where('isArchived', '!=', true),
      );
    },
    async fetchCurrentUserSections(): Promise<void> {
      const query = this.getCurrentUserSectionsQuery();
      if (!query) return;
      const snapshot = await getDocs(query);
      this.sections = snapshot.docs.map((doc) => AntelopeSection.deserializeFromDocSnapshot(doc));
    },
    async addNewSection(section: AntelopeSection): Promise<void> {
      const document = this.getDocument(section.id);
      const { goals, ...rest } = section.serialize();
      await setDoc(document, rest);
      this.sections.push(section);
    },
    async updateSection(section: AntelopeSection): Promise<void> {
      const document = this.getDocument(section.id);
      await updateDoc(document, { name: section.name, icon: section.icon });
      const foundSection = this.sections.find((s) => s.id === section.id);
      if (!foundSection) return;
      foundSection.name = section.name;
      foundSection.icon = section.icon;
    },
    async setGoals(section: AntelopeSection): Promise<void> {
      if (!section.goals) return;
      const document = this.getDocument(section.id);
      await updateDoc(document, { goals: section.goals.serialize() });
      const foundSection = this.sections.find((s) => s.id === section.id);
      if (!foundSection) return;
      foundSection.goals = section.goals;
    },
    async resetGoals(section: AntelopeSection): Promise<void> {
      if (!section.goals) return;
      const goalStore = useGoalStore();
      const document = this.getDocument(section.id);
      const { goals, ...rest } = section.serialize();
      await goalStore.archiveGoal(section.goals, section.id);
      await setDoc(document, rest);
      const foundSection = this.sections.find((s) => s.id === section.id);
      if (!foundSection) return;
      foundSection.goals = undefined;
    },
    async deleteSection(id: string): Promise<void> {
      const document = this.getDocument(id);
      await deleteDoc(document);
      this.sections = this.sections.filter((section) => section.id !== id);
    },
    async archiveSection(section: AntelopeSection): Promise<void> {
      const document = this.getDocument(section.id);
      await updateDoc(document, { isArchived: true });
      this.sections = this.sections.filter((s) => s.id !== section.id);
    }
  }
})
