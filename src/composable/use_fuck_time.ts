import { AntelopeRange } from './../model/AntelopeRange';
import { AntelopeMonth } from '@/model/AntelopeMonth';
import { AntelopeSection } from '@/model/AntelopeSection';
import { useSectionStore } from '@/store/section';
import { tryOnMounted, tryOnUnmounted } from "@vueuse/core";
import { doc, onSnapshot, getDocs, Unsubscribe } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Ref, ref, computed, watch } from "vue";

export interface Time {
    sectionId: string;
    sectionName: string;
    timeSpendInSeconds: number;
}

export const useFuckTime = (date: Ref<Date>) => {
    const store = useSectionStore();
    let unsubscribers: Unsubscribe[] = [];

    const sections = ref<AntelopeSection[]>([]);
    const times = ref<Time[]>([]);

    const getCurrentDayRangesFromMonth = (month: AntelopeMonth): AntelopeRange[] => {
        return month.ranges
            .filter((range) => range.startDate.toDateString() === date.value.toDateString());
    };

    const fuckedTimeInSeconds = computed<number>(() => {
        const h24InSeconds = 24 * 60 * 60;
        const spendTime = times.value
            .map((time) => time.timeSpendInSeconds)
            .reduce((a, b) => a + b, 0);
        return h24InSeconds - spendTime;
    });

    const subscribeMonth = (section: AntelopeSection) => {
        const monthId = AntelopeMonth.getMonthId(date.value);
        const document = doc(firestore, 'sections', section.id, 'months', monthId);
        const unsubscriber = onSnapshot(document, (snapshot) => {
            const month = AntelopeMonth.deserializeFromDocSnapshot(snapshot);
            const ranges = getCurrentDayRangesFromMonth(month);
            const timeSpendInSeconds = ranges
                .map((range) => range.secondsDiff)
                .reduce((a, b) => a + b, 0);
            const time: Time = {
                sectionId: section.id,
                sectionName: section.name,
                timeSpendInSeconds,
            };
            const index = times.value.findIndex((time) => time.sectionId === section.id);
            if (index === -1) times.value.push(time);
            else times.value = times.value.map((time) => {
                if (time.sectionId === section.id) return time;
                else return time;
            });
        });
        unsubscribers.push(unsubscriber);
    }

    const subscribe = () => {
        sections.value
            .forEach((section) => subscribeMonth(section as AntelopeSection));
    };

    const unsubscribe = () => {
        unsubscribers
            .forEach((unsubscriber) => unsubscriber());
        unsubscribers = [];
    }

    tryOnMounted(async () => {
        const query = store.getCurrentUserSectionsQuery();
        if (query) {
            const snapshot = await getDocs(query);
            sections.value = snapshot.docs.map((doc) => AntelopeSection.deserializeFromDocSnapshot(doc));
            subscribe();
        }
    });

    tryOnUnmounted(unsubscribe);

    watch(date, () => {
        unsubscribe();
        subscribe();
    });

    return {
        times,
        fuckedTimeInSeconds,
    }
}