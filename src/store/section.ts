import { firestore } from '@/firebase';
import { AntelopeSection } from '@/model/AntelopeSection';
import { defineStore } from 'pinia'
import { useAuth } from '@/composable/use_auth'
import {
  collection, CollectionReference,
  Query, where, query, getDocs, doc, setDoc,
  deleteDoc,
  DocumentReference
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
      return query(this.getCollection(), where('ownerUid', '==', currentUser.uid));
    },
    async fetchCurrentUserSections(): Promise<void> {
      const query = this.getCurrentUserSectionsQuery();
      if (!query) return;
      const snapshot = await getDocs(query);
      this.sections = snapshot.docs.map((doc) => AntelopeSection.deserializeFromDocSnapshot(doc));
    },
    async addNewSection(section: AntelopeSection): Promise<void> {
      const document = this.getDocument(section.id);
      await setDoc(document, section.serialize());
      this.sections.push(section);
    },
    async deleteSection(id: string): Promise<void> {
      const document = this.getDocument(id);
      await deleteDoc(document);
      this.sections = this.sections.filter((section) => section.id !== id);
    }
  }
})
