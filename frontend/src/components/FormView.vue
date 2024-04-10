<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import InputComp from './ui/InputComp.vue'
import SelectComp from './ui/SelectComp.vue'
import ButtonComp from './ui/ButtonComp.vue'
import type { ChartResponse } from '@/lib/utils'

// state management
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

// -- form logic
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
  } else if (formData.symbol.value.length > 5 || formData.symbol.value.length < 2) {
    formData.symbol.errorMsg = 'symbol lenght must be between 2 & 5.'
  } else if (/[^a-zA-Z0-9]/.test(formData.symbol.value)) {
    formData.symbol.errorMsg = 'symbol should not have special characters.'
  }
  return valid
}

const serverError = ref('')

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  formData.period.errorMsg = ''
  isLoading.value = true

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_IP}/api/search?symbol=${formData.symbol.value}&period=${formData.period.value}`
    )

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message)
    }

    emit('onChartData', responseData as ChartResponse[])
  } catch (err: any) {
    serverError.value = err?.message ?? 'server error'
  } finally {
    isLoading.value = false
  }
}

const period = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' }
]
</script>

<template>
  <form
    @submit.prevent="submitForm"
    class="py-2 px-6 flex gap-5 max-w-3xl items-center self-center flex-wrap justify-center"
  >
    <div class="w-60 flex-grow">
      <label
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Symbol:
      </label>
      <InputComp
        class="uppercase"
        placeholder="Enter symbol"
        name="symbol"
        v-model="formData.symbol.value"
        @input="formData.symbol.errorMsg = ''"
      />
      <span class="min-h-[18px] inline-block text-[0.8rem] font-medium text-destructive">
        {{ formData.symbol.errorMsg }}</span
      >
    </div>
    <div class="w-60 flex-grow">
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
    </div>
  </form>
  <div
    v-if="serverError"
    class="flex text-[0.8rem] mt-[-18px] font-medium text-destructive justify-center"
  >
    {{ serverError }}
  </div>
</template>
