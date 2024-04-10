<script setup lang="ts">
import InputComponent from './components/InputComponent.vue'
import RenderChart from './components/RenderChart.vue'
</script>

<template>
  <InputComponent />
  <select>
    <option>daily</option>
    <option>hourly</option>
  </select>
  <RenderChart />
</template>
<style scoped></style>
