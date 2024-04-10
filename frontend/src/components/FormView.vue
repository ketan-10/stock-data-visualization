<script setup lang="ts">
import { computed, reactive } from 'vue'
import InputComp from './ui/InputComp.vue'
import SelectComp from './ui/SelectComp.vue'
import ButtonComp from './ui/ButtonComp.vue'
import type { ChartResponse } from '@/lib/utils';

const formData = reactive({
  symbol: {
    value: '',
    errorMsg: ''
  },
  period: {
    value: '',
    errorMsg: ''
  }
})

const props = defineProps<{
    isLoading: boolean
}>()

const emit = defineEmits<{
  onChartData: [payload: ChartResponse[]],
  'update:isLoading': [payload: boolean]
}>()

// code like useVModel()
const isLoading = computed({
    get() {
        return props.isLoading
    },
    set(newValue) {
        emit('update:isLoading', newValue)
    }
})

type FormData = {
  [K in keyof typeof formData]: string
}



async function fetchData(data: typeof formData) {
  formData.symbol.errorMsg = ''
  formData.period.errorMsg = ''
  isLoading.value = true

  console.log(formData.period)

  try {
    const reponseData: ChartResponse[] = await fetch(
      `http://localhost:8080/api/search?symbol=${data.symbol.value}&period=${data.period.value}`
    ).then((r) => r.json())

    if (!reponseData) {
      return null
    }

    console.log(reponseData)
    emit('onChartData', reponseData)
  } catch (err) {
    // error.value = err.toString()
  } finally {
    isLoading.value = false
  }
}

const submitForm = (e: any) => {
  fetchData(formData)
}

const period = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' }
]
</script>

<template>
  <form
    @submit.prevent="submitForm"
    class="py-2 flex gap-5 max-w-3xl items-center m-auto flex-wrap justify-center"
  >
    <div class="w-60 p-4 flex-grow">
      <label> Symbol: </label>
      <InputComp placeholder="Enter symbol" name="symbol" v-model="formData.symbol.value" />
      <span> {{ formData.symbol.errorMsg }}</span>
    </div>
    <div class="w-60 flex-grow">
      <label> Period: </label>
      <SelectComp placeholder="Select period" v-model="formData.period.value" :options="period" />
    </div>
    <div class="flex-grow max-w-40 align-middle">
      <ButtonComp type="submit"> Search </ButtonComp>
    </div>
  </form>
</template>
