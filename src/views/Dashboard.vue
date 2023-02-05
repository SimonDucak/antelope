<template>
  <v-layout>
    <ADrawer />

    <v-main class="d-flex w-screen overflow-hidden w-100">
      <ALogger />

      <!-- Right side / Charts -->
      <AChart />
    </v-main>

    <!-- Is Running -->
    <div v-if="isRunning" class="progress-bar">
      <v-progress-linear indeterminate color="success"></v-progress-linear>
    </div>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import ADrawer from "@/components/ADrawer.vue";
import { useTask } from "@/composable/use_task";
import { useSectionStore } from "@/store/section";
import ALogger from "@/components/ALogger.vue";
import { useRouter } from "vue-router";
import AChart from "@/components/AChart.vue"
import { AntelopeMonth } from "@/model/AntelopeMonth";

const sectionsStore = useSectionStore();
const { push } = useRouter()

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
</style>