<script setup lang="ts">
import { ref, watch } from 'vue'

import LWChart from './LWChart.vue'
import { genSeededData } from '@/api/generator'

const props = defineProps<{
  serverData: CharacterData[]
}>()

const data = ref([] as CharacterData[])

watch(
  () => props.serverData,
  () => {
    data.value = props.serverData
    console.log('I have: ', props.serverData)
  }
)

const chartOptions = ref({})

const seriesOptions = ref({
  color: 'rgb(45, 77, 205)'
})
const chartType = ref('candlestick')
const lwChart = ref()

function randomShade() {
  return Math.round(Math.random() * 255)
}

const randomColor = (alpha = 1) => {
  return `rgba(${randomShade()}, ${randomShade()}, ${randomShade()}, ${alpha})`
}

const colorsTypeMap = {
  area: [
    ['topColor', 0.4],
    ['bottomColor', 0],
    ['lineColor', 1]
  ],
  bar: [
    ['upColor', 1],
    ['downColor', 1]
  ],
  baseline: [
    ['topFillColor1', 0.28],
    ['topFillColor2', 0.05],
    ['topLineColor', 1],
    ['bottomFillColor1', 0.28],
    ['bottomFillColor2', 0.05],
    ['bottomLineColor', 1]
  ],
  candlestick: [
    ['upColor', 1],
    ['downColor', 1],
    ['borderUpColor', 1],
    ['borderDownColor', 1],
    ['wickUpColor', 1],
    ['wickDownColor', 1]
  ],
  histogram: [['color', 1]],
  line: [['color', 1]]
}

// Set a random colour for the series as an example of how
// to apply new options to series. A similar appraoch will work on the
// option properties.
const changeColors = () => {
  const options = {}
  const colorsToSet = colorsTypeMap[chartType.value]
  colorsToSet.forEach((c) => {
    options[c[0]] = randomColor(c[1])
  })
  seriesOptions.value = options
}

const changeData = () => {
  const candlestickTypeData = ['candlestick', 'bar'].includes(chartType.value)
  const newData = genSeededData(candlestickTypeData)
  data = newData
  if (chartType.value === 'baseline') {
    const average =
      newData.reduce((s, c) => {
        return s + c.value
      }, 0) / newData.length
    seriesOptions.value = { baseValue: { type: 'price', price: average } }
  }
}

const changeType = () => {
  const types = ['line', 'candlestick'].filter((t) => t !== chartType.value)
  const randIndex = Math.round(Math.random() * (types.length - 1))
  chartType.value = types[randIndex]
  changeData()

  // call a method on the component.
  lwChart.value.fitContent()
}
</script>

<template>
  <div class="chart-container h-[70vh] max-h-80">
    <LWChart
      :type="chartType"
      :data="data"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
      ref="lwChart"
    />
  </div>
  <button type="button" @click="changeColors">Set Random Colors</button>
  <button type="button" @click="changeType">Change Chart Type</button>
  <button type="button" @click="changeData">Change Data</button>
</template>
<style scoped>
.chart-container {
  height: 70vh;
}
</style>
