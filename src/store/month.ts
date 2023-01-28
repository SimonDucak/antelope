import { AntelopeRange } from './../model/AntelopeRange';
import { useSectionStore } from '@/store/section';
import { AntelopeMonth } from '@/model/AntelopeMonth';
import { defineStore } from 'pinia';
import {
  doc, setDoc, deleteDoc,
  DocumentReference, collection as getCollection,
  query as getQuery, where, getDocs
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useAuth } from '@/composable/use_auth';

export const useMonthStore = defineStore('month', {
  state: (): { month: AntelopeMonth | null } => ({
    month: null,
  }),
  actions: {
    getDocument(id: string, sectionId: string): DocumentReference {
      const { getDocument } = useSectionStore();
      return doc(getDocument(sectionId), 'months', id);
    },
    async getMonth(id: string, sectionId: string): Promise<AntelopeMonth | null> {
      const { currentUser } = useAuth();
      if (!currentUser) return null;
      const collection = getCollection(firestore, 'sections', sectionId, 'months');
      const query = getQuery(collection, where('id', '==', id), where('ownerUid', '==', currentUser.uid));
      const querySnapshot = await getDocs(query);
      if (querySnapshot.empty) return null;
      return AntelopeMonth.deserializeFromDocSnapshot(querySnapshot.docs[0]);
    },
    async fetchMonth(id: string, sectionId: string): Promise<void> {
      this.month = await this.getMonth(id, sectionId);
    },
    async resolveMonth(id: string, sectionId: string): Promise<void> {
      await this.fetchMonth(id, sectionId);
      if (this.month !== null) return;
      const newMonth = AntelopeMonth.emptyMonth(id);
      await this.addNewMonth(newMonth, sectionId);
      this.month = newMonth;
    },
    async addNewMonth(month: AntelopeMonth, sectionId: string): Promise<void> {
      const document = this.getDocument(month.id, sectionId);
      await setDoc(document, month.serialize());
    },
    async deleteMonth(id: string, sectionId: string): Promise<void> {
      const document = this.getDocument(id, sectionId);
      await deleteDoc(document);
    },
    async updateMonth(month: AntelopeMonth, sectionId: string): Promise<void> {
      const document = this.getDocument(month.id, sectionId);
      await setDoc(document, month.serialize());
    },
    async addRange(range: AntelopeRange, sectionId: string): Promise<void> {
      if (!this.month) return;
      try {
        if (range.monthId === this.month.id) {
          this.month.ranges.push(range);
          await this.updateMonth(this.month as AntelopeMonth, sectionId);
        } else {
          const foundMonth = await this.getMonth(range.monthId, sectionId);
          if (!foundMonth) await this.addNewMonth(new AntelopeMonth([range], range.monthId), sectionId);
          else {
            foundMonth.ranges.push(range);
            await this.updateMonth(foundMonth, sectionId);
          }
        }
      } catch (err) {
        this.month.ranges = this.month.ranges.filter((r) => r.id !== range.id);
        console.log(err);
        alert(err);
      }
    },
    async deleteRange(range: AntelopeRange, sectionId: string): Promise<void> {
      if (!this.month) return;
      try {
        this.month.ranges = this.month.ranges.filter((r) => r.id !== range.id);
        await this.updateMonth(this.month as AntelopeMonth, sectionId);
      } catch (err) {
        console.log(err);
        this.month.ranges.push(range as AntelopeRange);
        alert(err);
      }
    }
  }
});