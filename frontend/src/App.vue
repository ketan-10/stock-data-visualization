<script setup lang="ts">
import RenderChart from './components/charts/RenderChart.vue'
import FormView from './components/FormView.vue'
import HeaderView from './components/HeaderView.vue'
import { provide, ref } from 'vue'
import type { ChartResponse } from '@/Constants'
import TabComp from './components/ui/TabComp.vue'

const isDarkMode = ref(!!localStorage.getItem('isDarkMode'))

provide('isDarkMode', isDarkMode)

const isChartLoading = ref(false)

const TABS = ['candlestick', 'line']
const currentChart = ref('candlestick')

const chartData = ref<ChartResponse[]>([])

const onChartData = (data: ChartResponse[]) => {
  chartData.value = data
}
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full z-[9999] top-0 left-0 fixed h-14 flex">
      <HeaderView />
    </div>
    <div class="pt-14 w-full h-[100svh] flex flex-col">
      <FormView v-model:isLoading="isChartLoading" @onChartData="onChartData" />
      <div v-if="isChartLoading" id="spinner"></div>
      <template v-else>
        <div class="w-full md:w-80 self-center mb-5 px-5">
          <TabComp v-if="chartData.length" v-model="currentChart" :tabs="TABS" />
        </div>
        <RenderChart v-if="chartData.length" :serverData="chartData" :chartType="currentChart" />
      </template>
    </div>
  </div>
</template>
<style scoped></style>
