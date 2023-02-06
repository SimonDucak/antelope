<template>
  <v-layout>
    <ADrawer />

    <v-main class="d-flex w-screen overflow-hidden w-100">
      <ALogger />

      <!-- Right side / Charts -->
      <AChart />
    </v-main>

    <div class="fucked-time">
      <p class="text-body-2">
        Dnešný prejebaný čas = {{ formatSecondsToHhmmss(fuckedTimeInSeconds) }}
        <u style="cursor: pointer" class="text-body-2 text-success">
          more details
          <v-dialog transition="dialog-bottom-transition" v-model="modalVisible" activator="parent">
            <AFuckTimeChart v-model:visible="modalVisible" :times="times" />
          </v-dialog>
        </u>
      </p>
    </div>

    <!-- Is Running -->
    <div v-if="isRunning" class="progress-bar">
      <v-progress-linear indeterminate color="success"></v-progress-linear>
    </div>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import ADrawer from "@/components/ADrawer.vue";
import { useTask } from "@/composable/use_task";
import { useSectionStore } from "@/store/section";
import ALogger from "@/components/ALogger.vue";
import { useRouter } from "vue-router";
import AChart from "@/components/AChart.vue"
import { AntelopeMonth } from "@/model/AntelopeMonth";
import { useFuckTime } from "@/composable/use_fuck_time";
import { formatSecondsToHhmmss } from '@/utils/number';
import AFuckTimeChart from '@/components/AFuckTimeChart.vue';

const sectionsStore = useSectionStore();
const { push } = useRouter();

const today = ref(new Date());
const modalVisible = ref(false);

const { fuckedTimeInSeconds, times } = useFuckTime(today);

const { perform, isRunning } = useTask(async () => {
  try {
    await sectionsStore.fetchCurrentUserSections();
    if (sectionsStore.sections.length) {
      push({
        path: '/dashboard',
        query: {
          section: sectionsStore.sections[0].id,
          month: AntelopeMonth.getMonthId(new Date())
        }
      })
    }
  } catch (err) {
    console.log(err);
    alert(err);
  }
});

onMounted(() => { perform(); })
</script>

<style lang="scss" scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 9999;
}

.fucked-time {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  padding: 3px 12px;
  background-color: black;
}
</style>