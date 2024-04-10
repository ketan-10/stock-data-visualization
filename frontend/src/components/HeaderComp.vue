<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Switch } from '@headlessui/vue'
import Sun from '@/assets/icons/sun.svg'
import Moon from '@/assets/icons/moon.svg'


const isLightMode: Ref<boolean> = inject('isLightMode', ref(true))

watch(isLightMode, (lightsPlz) => {
  if (lightsPlz) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="bg-white flex w-full shadow align-middle">
    <div class="flex justify-between w-full items-center p-3">
      <div class="cursor-pointer text-red-600 dark:text-green-500">Hello 1</div>
      <div class="flex gap-5">
        <div class="py-16">
          <Switch
            v-model="isLightMode"
            :class="isLightMode ? 'bg-teal-900' : 'bg-teal-700'"
            class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            <span class="sr-only">Use setting</span>
            <img
              aria-hidden="true"
              :src="isLightMode ? Sun: Moon"
              :class="isLightMode ? 'translate-x-9' : 'translate-x-0'"
              class="pointer-events-none p-[5px] inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
            />
          </Switch>
        </div>
      </div>
    </div>
  </div>
</template>
