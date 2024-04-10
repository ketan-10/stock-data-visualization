<script setup lang="ts">
import InputComp from './components/InputComp.vue'
import RenderChart from './components/RenderChart.vue'
import SelectComp from './components/SelectComp.vue'
import HeaderComp from './components/HeaderComp.vue'
import { provide, ref, watch } from 'vue'
import ButtonComp from './components/ButtonComp.vue'

const isDarkMode = ref(false)

provide('isDarkMode', isDarkMode)

watch(isDarkMode, (newMode) => {
  console.log(newMode)
})
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="w-full z-[9999] top-0 left-0 fixed h-14 flex">
      <HeaderComp />
    </div>
    <div class="pt-14 w-full min-h-screen">
      <div class="py-2 flex gap-5 max-w-3xl items-center m-auto flex-wrap justify-center">
        <div class="w-60 p-4 flex-grow">
          <label> Symbol: </label>
          <InputComp placeholder="Enter symbol"/>
        </div>
        <div class="w-60 flex-grow">
          <label> Period: </label>
          <SelectComp/>
        </div>
        <div class="flex-grow max-w-40 align-middle">
          <ButtonComp> Search </ButtonComp>
        </div>
      </div>
      <RenderChart />
    </div>
  </div>
</template>
<style scoped></style>
