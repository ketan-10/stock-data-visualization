<script setup lang="ts">
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import ChevronIcon from '@/assets/icons/chevron-up-down.svg?raw'
import CheckIcon from '@/assets/icons/check.svg?raw'

const props = withDefaults(
  defineProps<{
    modelValue: string | Number
    options: { label: string; value: string, disable?: boolean}[]
    placeholder?: string
  }>(),
  {
    placeholder: 'Select option'
  }
)

const emit = defineEmits(['update:modelValue'])

const label = computed(() => {
  return props.options
    .filter((option) => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(option.value)
      }

      return props.modelValue === option.value
    })
    .map((option) => option.label)
    .join(', ')
})
</script>
<template>
  <Listbox
    :model-value="props.modelValue"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="relative mt-1">
      <ListboxButton
        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed"
      >
        <span v-if="label" class="block truncate">{{ label }}</span>
        <span v-else class="text-gray-500">{{ props.placeholder }}</span>
        <span class="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
          <div class="h-5 w-5 top-5 left-5 self-center">
            <div class="object-contain h-full w-full" v-html="ChevronIcon"></div>
          </div>
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="overflow-auto absolute z-50 mt-1 w-full max-h-60 text-base bg-popover text-popover-foreground rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in props.options"
            :key="option.label"
            v-slot="{ active, selected }"
            :value="option.value"
            as="template"
            :disabled="option.disable"
          >
            <li
              :class="[
                active ? 'bg-amber-200 text-amber-900' : '',
                'relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-10 pr-4 focus:bg-accent focus:text-accent-foreground',
                option.disable ? 'bg-gray-300 cursor-not-allowed' : ''
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                option.label
              }}</span>
              <span
                v-if="selected"
                class="flex absolute inset-y-0 left-0 items-center pl-3 [--check-stroke:#d97706]"
              > 
                <div class="h-5 w-5" v-html="CheckIcon"></div>
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
