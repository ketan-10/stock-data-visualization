<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'

import LWChart from './LWChart.vue'
import type { ChartResponse } from '@/Constants'

const props = defineProps<{
  serverData: ChartResponse[]
  chartType: string
}>()

const data = ref(props.serverData)

const isDarkMode: Ref<boolean> = inject('isDarkMode', ref(false))

watch(
  () => props.serverData,
  () => {
    data.value = props.serverData
  }
)

const chartOptions = computed(() => {
  if (isDarkMode.value) {
    return {
      layout: {
        background: { color: '#222' },
        textColor: '#DDD'
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      }
    }
  }
  return {
    layout: {
      background: { color: '#FFFFFF' },
      textColor: '#191919'
    },
    grid: {
      vertLines: { color: '#D6DCDE' },
      horzLines: { color: '#D6DCDE' }
    }
  }
})

const seriesOptions = ref({
  color: '#90400e'
})
const lwChart = ref()
</script>

<template>
  <div class="chart-container h-[60svh] min-h-56 p-5">
    <LWChart
      :type="props.chartType"
      :data="data"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
      ref="lwChart"
    />
  </div>
</template>
