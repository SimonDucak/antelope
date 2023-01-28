<template>
  <div class="d-flex flex-column align-center">
    <h3 class="text-h3 mb-1">{{ hhmmss }}</h3>
    <p class="text-body-2 mb-3">
      <span v-if="isRunning && startDate">Start from: {{ getTheTrueFortmatOfDate(startDate) }}</span>
      <span v-else>Start timer by clicking on button below.</span>
    </p>
    <v-btn v-if="!isRunning" @click="start">Start timer</v-btn>
    <v-btn v-else color="success" @click="save">Save time</v-btn>
  </div>
</template>
 
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { getSecondsBetweenTwoDates, getTheTrueFortmatOfDate } from '@/utils/date';
import { formatSecondsToHhmmss } from '@/utils/number';
import { AntelopeRange } from '@/model/AntelopeRange';

const emit = defineEmits(['update:value']);

const startDate = ref<Date | null>(null);
const totalSeconds = ref<number>(0);
const intervalId = ref<number>(-1);

const incrementTotalSeconds = () => {
  if (!startDate.value) return;
  const seconds = getSecondsBetweenTwoDates(startDate.value, new Date());
  totalSeconds.value = Math.floor(seconds);
}

const startRenderingCycle = () => {
  intervalId.value = window.setInterval(incrementTotalSeconds, 1000);
}

const clearRenderingCycle = () => {
  clearInterval(intervalId.value);
  intervalId.value = -1;
  startDate.value = null;
  totalSeconds.value = 0;
}

const isRunning = computed<boolean>(() => intervalId.value >= 0);
const hhmmss = computed<string>(() => formatSecondsToHhmmss(totalSeconds.value))

const start = () => {
  startRenderingCycle();
  startDate.value = new Date();
};

const save = () => {
  const eDate = new Date();
  const sDate = startDate.value;
  clearRenderingCycle();
  if (sDate) {
    const range = new AntelopeRange(sDate.getTime(), eDate.getTime());
    emit('update:value', range);
  }
}
</script>