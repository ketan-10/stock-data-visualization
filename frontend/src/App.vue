<script setup lang="ts">
import RenderChart from './components/charts/RenderChart.vue'
import FormView from './components/FormView.vue';
import HeaderView from './components/HeaderView.vue'
import { provide, reactive, ref, watch } from 'vue'

const isDarkMode = ref(false)

provide('isDarkMode', isDarkMode)

watch(isDarkMode, (newMode) => {
  console.log(newMode)
})

</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full z-[9999] top-0 left-0 fixed h-14 flex">
      <HeaderView />
    </div>
    <div class="pt-14 w-full min-h-screen">
      <FormView/>
      <RenderChart />
    </div>
  </div>
</template>
<style scoped></style>
