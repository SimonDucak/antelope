<template>
  <v-main class="d-flex w-screen overflow-hidden w-100">
    <div class="w-50 d-flex flex-column align-center h-screen overflow-auto border-r">
      <!-- Time Range Picker -->
      <div class="border-b w-100 py-16 px-10 d-flex flex-column align-center justify-center" style="min-height: 300px">
        <ATimeRangePicker @update:value="ranges.push($event)" />
      </div>

      <ARangeTable v-model:ranges="(ranges as AntelopeRange[])" />
    </div>

    <div class="w-50 h-screen overflow-auto"></div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ATimeRangePicker from "@/components/ATimeRangePicker.vue";
import { AntelopeRange } from "@/model/AntelopeRange";
import ARangeTable from "@/components/ARangeTable.vue";

const ranges = ref<AntelopeRange[]>([]);
</script>
