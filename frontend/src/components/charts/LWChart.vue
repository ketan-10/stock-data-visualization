<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type HorzScaleOptions,
  type DeepPartial,
  type ChartOptions,
  type PriceScaleOptions
} from 'lightweight-charts'

type PropDef = {
  type: string
  data: any[]
  autosize: Boolean
  chartOptions?: DeepPartial<ChartOptions>
  seriesOptions?: any
  timeScaleOptions?: DeepPartial<HorzScaleOptions>
  priceScaleOptions?: DeepPartial<PriceScaleOptions>
}

const props = defineProps<PropDef>()

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type: string) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`
}

// Lightweight Charts instances are stored as normal JS variables
let series: ISeriesApi<any> | null
let chart: IChartApi | null

const chartContainer = ref()

const fitContent = () => {
  if (!chart) return
  chart.timeScale().fitContent()
}

const getChart = () => {
  return chart
}

defineExpose({ fitContent, getChart })

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
  if (!chart || !chartContainer.value) return
  const dimensions = chartContainer.value.getBoundingClientRect()
  chart.resize(dimensions.width, dimensions.height)
}

// Creates the chart series and sets the data.
const addSeriesAndData = (props: PropDef) => {
  chart?.addCandlestickSeries
  const seriesConstructor = getChartSeriesConstructorName(props.type)
  if (!chart) return

  series = (chart as any)[seriesConstructor](props.seriesOptions)
  if (!series) return
  series.setData(props.data)
}

onMounted(() => {
  chart = createChart(chartContainer.value, props.chartOptions)

  addSeriesAndData(props)

  if (props.priceScaleOptions) {
    chart.priceScale('').applyOptions(props.priceScaleOptions)
  }

  if (props.timeScaleOptions) {
    chart.timeScale().applyOptions(props.timeScaleOptions)
  }

  chart.timeScale() // .fitContent()

  if (props.autosize) {
    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (chart) {
    chart.remove()
    chart = null
  }
  if (series) {
    series = null
  }
  window.removeEventListener('resize', resizeHandler)
})

watch(
  () => props.autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener('resize', resizeHandler)
      return
    }
    window.addEventListener('resize', resizeHandler)
  }
)

watch(
  () => props.type,
  () => {
    if (series && chart) {
      chart.removeSeries(series)
    }
    addSeriesAndData(props)
  }
)

watch(
  () => props.data,
  (newData) => {
    if (!series) return
    series.setData(newData)
  }
)

watch(
  () => props.chartOptions,
  (newOptions) => {
    if (!chart || !newOptions) return
    chart.applyOptions(newOptions)
  }
)

watch(
  () => props.seriesOptions,
  (newOptions) => {
    if (!series || !newOptions) return
    series.applyOptions(newOptions)
  }
)

watch(
  () => props.priceScaleOptions,
  (newOptions) => {
    if (!chart || !newOptions) return
    chart.priceScale('').applyOptions(newOptions)
  }
)

watch(
  () => props.timeScaleOptions,
  (newOptions) => {
    if (!chart || !newOptions) return
    chart.timeScale().applyOptions(newOptions)
  }
)
</script>

<template>
  <div class="lw-chart h-full" ref="chartContainer"></div>
</template>
