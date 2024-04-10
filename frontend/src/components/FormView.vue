<script setup lang="ts">
import { reactive } from 'vue'
import InputComp from './ui/InputComp.vue';
import SelectComp from './ui/SelectComp.vue';
import ButtonComp from './ui/ButtonComp.vue';

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

const submitForm = (e) => {
  formData.symbol.errorMsg = 'failed'
  formData.period.value = 'hourly'
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
