<script setup lang="ts">
import InputComp from './components/InputComp.vue'
import RenderChart from './components/RenderChart.vue'
import SelectComp from './components/SelectComp.vue'
import HeaderComp from './components/HeaderComp.vue'
import { provide, ref, watch } from 'vue'

const isLightMode = ref(true)

provide('isLightMode', isLightMode);

watch(isLightMode, (newMode) => {
  console.log(newMode)
})
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full z-[9999] top-0 left-0 fixed h-14 flex">
      <HeaderComp />
    </div>
    <div class="pt-14 w-full min-h-screen">
      <h1 class="text-3xl">Welcome to {{ isLightMode }}</h1>
      <SelectComp />
      <div class="flex">
        <InputComp />
      </div>
      <RenderChart />
    </div>
  </div>
</template>
<style scoped></style>
