<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

// using component v-model patten https://vuejs.org/guide/components/v-model.html
// using computed : https://youtu.be/qGqebwUxWrw?si=4k5OuLQEOeKKUGWp

const props = defineProps<{
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

defineEmits<{
  'update:modelValue': [payload: string | number]
}>()
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    :class="[
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1',
      props.class
    ]"
  />
</template>
