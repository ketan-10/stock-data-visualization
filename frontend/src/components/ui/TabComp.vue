<script setup lang="ts">
import { Tab, TabGroup, TabList } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  tabs: string[]
}>()

defineEmits<{
  'update:modelValue': [payload: string]
}>()
</script>

<template>
  <TabGroup
    :selectedIndex="props.tabs.findIndex((t) => t == props.modelValue)"
    @change="(idx) => $emit('update:modelValue', props.tabs[idx])"
  >
    <TabList class="flex space-x-1 rounded-xl bg-amber-900/20 p-1">
      <Tab v-for="category in props.tabs" as="template" :key="category" v-slot="{ selected }">
        <button
          :class="[
            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
            'ring-white/60 ring-offset-2 ring-offset-amber-400 focus:outline-none focus:ring-2',
            selected
              ? 'bg-white text-amber-700 shadow'
              : 'text-yellow-600 hover:bg-white/[0.12] hover:text-amber-900'
          ]"
        >
          {{ category }}
        </button>
      </Tab>
    </TabList>
  </TabGroup>
</template>
