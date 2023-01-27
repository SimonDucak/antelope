<template>
  <v-layout>
    <!-- Drawer / Navigation -->
    <ADrawer />

    <v-main class="d-flex w-screen overflow-hidden w-100">
      <!-- Left side -->
      <div class="w-50 d-flex flex-column align-center h-screen overflow-auto border-r">
        <!-- Time Range Picker -->
        <div class="border-b w-100 py-16 px-10 d-flex flex-column align-center justify-center"
          style="min-height: 300px">
          <ATimeRangePicker @update:value="ranges.push($event)" />
        </div>

        <!-- Range table -->
        <ARangeTable v-model:ranges="(ranges as AntelopeRange[])" />
      </div>

      <!-- Right side / Charts -->
      <div class="w-50 h-screen overflow-auto"></div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ATimeRangePicker from "@/components/ATimeRangePicker.vue";
import { AntelopeRange } from "@/model/AntelopeRange";
import ARangeTable from "@/components/ARangeTable.vue";
import ADrawer from "@/components/ADrawer.vue";
import AAddSectionModal from "@/components/AAddSectionForm.vue";

const ranges = ref<AntelopeRange[]>([]);
const modalVisible = ref<boolean>(false);
</script>
