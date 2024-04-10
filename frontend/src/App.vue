<script setup lang="ts">
import RenderChart from './components/charts/RenderChart.vue'
import FormView from './components/FormView.vue'
import HeaderView from './components/HeaderView.vue'
import { provide, reactive, ref, watch } from 'vue'
import type { ChartResponse } from './lib/utils'
import { genSeededData } from './api/generator'
import TabComp from './components/ui/TabComp.vue'

const isDarkMode = ref(!!localStorage.getItem('isDarkMode'))

provide('isDarkMode', isDarkMode)

watch(isDarkMode, (newMode) => {
  console.log(newMode)
})

const isChartLoading = ref(false)

const TABS = ['candlestick', 'line']
const currentChart = ref('candlestick')

const chartData = ref<ChartResponse[] | null>([])

const onChartData = (data: ChartResponse[]) => {
  chartData.value = data
  console.log('Parent Data: ', data)
  // console.log('Parent Generated Data: ', genSeededData(true))
}
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full z-[9999] top-0 left-0 fixed h-14 flex">
      <HeaderView />
    </div>
    <div class="pt-14 w-full min-h-screen flex flex-col">
      <FormView v-model:isLoading="isChartLoading" @onChartData="onChartData" />
      <div class="w-full md:w-80 self-center mb-5">
        <TabComp v-model="currentChart" :tabs="TABS" />
      </div>
      <!-- <RenderChart :myData="chartData" /> -->
      <div v-if="!!chartData">
        <RenderChart :serverData="chartData" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
