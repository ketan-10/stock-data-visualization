<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import ComboboxComp from './ui/ComboboxComp.vue'
import SelectComp from './ui/SelectComp.vue'
import ButtonComp from './ui/ButtonComp.vue'
import { dataCsvToJson, type ChartResponse } from '@/Constants'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  onChartData: [payload: ChartResponse[]]
  'update:isLoading': [payload: boolean]
}>()

const isLoading = computed({
  get() {
    return props.isLoading
  },
  set(newValue) {
    emit('update:isLoading', newValue)
  }
})

const period = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly', disable: true }
]

// form logic
const formData = reactive({
  symbol: {
    value: '',
    errorMsg: ''
  },
  period: {
    value: 'daily',
    errorMsg: ''
  }
})

export type FormData = {
  [K in keyof typeof formData]: string
}

// submitting and data fetching
const validateForm = () => {
  let valid = true
  if (!formData.period.value) {
    formData.period.errorMsg = 'Please select an period'
    valid = false
  }
  if (!formData.symbol.value) {
    formData.symbol.errorMsg = 'Required'
    valid = false
  } else if (formData.symbol.value.length > 10 || formData.symbol.value.length < 2) {
    formData.symbol.errorMsg = 'symbol lenght must be between 2 & 5.'
    valid = false
  } else if (/[^a-zA-Z0-9]/.test(formData.symbol.value)) {
    formData.symbol.errorMsg = 'symbol should not have special characters.'
    valid = false
  }
  return valid
}

const serverError = ref('')

// https://austingil.com/cancel-duplicate-fetch-requests-in-javascript-enhanced-forms/
let preController: AbortController

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  if (preController) {
    preController.abort()
  }
  const controller = (preController = new AbortController())

  formData.period.errorMsg = ''
  formData.symbol.errorMsg = ''
  serverError.value = ''

  isLoading.value = true

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_IP}/master/cron/output/${formData.symbol.value}.csv`,
      { signal: controller.signal }
    )

    const bodyText = await response.text()

    // everything bellow should be synchronous.
    // to avoid race condition with AbortController
    // As if we await here and someone change input in between. there might be flash of old data.
    const responseData = dataCsvToJson(bodyText)

    if (!response.ok) {
      throw new Error('failed to load data')
    }

    isLoading.value = false
    emit('onChartData', responseData as ChartResponse[])
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      serverError.value = err?.message ?? 'Server error'
      isLoading.value = false
    } else {
      console.log('Request already Aborted.')
    }
  }
}
</script>

<template>
  <form
    autocomplete="off"
    @submit.prevent="submitForm"
    class="py-2 px-6 flex gap-x-5 w-full items-center self-center flex-wrap justify-center"
  >
    <div class="max-w-96 flex-grow pt-3">
      <label
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Symbol:
      </label>
      <ComboboxComp
        @update="
          (v) => {
            formData.symbol.value = v
            submitForm()
          }
        "
        @change="formData.symbol.errorMsg = ''"
        @errorFetching="(msg) => (serverError = msg)"
      />
      <span class="min-h-[18px] inline-block text-[0.8rem] font-medium text-destructive">
        {{ formData.symbol.errorMsg }}</span
      >
    </div>
    <!-- <div class="w-60 flex-grow">
      <label
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Period:
      </label>

      <SelectComp
        placeholder="Select period"
        v-model="formData.period.value"
        :options="period"
        @update:modelValue="formData.period.errorMsg = ''"
      />
      <span class="min-h-[18px] inline-block text-[0.8rem] font-medium text-destructive">
        {{ formData.period.errorMsg }}</span
      >
    </div>
    <div class="flex-grow max-w-40 align-middle">
      <ButtonComp type="submit"> Search </ButtonComp>
    </div> -->
  </form>
  <div
    v-if="serverError"
    class="flex text-[0.8rem] mt-[-18px] font-medium text-destructive justify-center"
  >
    {{ serverError }}
  </div>
</template>
