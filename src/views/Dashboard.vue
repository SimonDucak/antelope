<template>
  <v-layout>
    <ADrawer />

    <v-main class="d-flex w-screen overflow-hidden w-100">
      <ALogger />

      <!-- Right side / Charts -->
      <div class="w-50 h-screen overflow-auto"></div>
    </v-main>

    <!-- Is Running -->
    <div v-if="isRunning" class="progress-bar">
      <v-progress-linear indeterminate color="success"></v-progress-linear>
    </div>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { AntelopeRange } from "@/model/AntelopeRange";
import ADrawer from "@/components/ADrawer.vue";
import { useTask } from "@/composable/use_task";
import { useSectionStore } from "@/store/section";
import ALogger from "@/components/ALogger.vue";

const sections = useSectionStore();

const ranges = ref<AntelopeRange[]>([]);

const { perform, isRunning } = useTask(async () => {
  try {
    await sections.fetchCurrentUserSections();
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