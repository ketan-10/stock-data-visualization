<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Switch } from '@headlessui/vue'
import Sun from '@/assets/icons/sun.svg?raw'
import Moon from '@/assets/icons/moon.svg?raw'
import Github from '@/assets/icons/github.svg?raw'

const isDarkMode: Ref<boolean> = inject('isDarkMode', ref(false))

watch(isDarkMode, (lightsPlz) => {
  if (lightsPlz) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="bg-primary-foreground flex w-full shadow align-middle">
    <div class="flex justify-between w-full items-center p-3">
      <div class="text-xl pl-4">Stocks visualizer</div>
      <div class="flex gap-3">
        <div class="h-8 top-5 left-5 self-center w-10">
          <div class="object-contain h-full w-full" v-html="Github"></div>
        </div>
        <div class="self-center leading-none">
          <Switch
            v-model="isDarkMode"
            :class="isDarkMode ? 'bg-amber-900' : 'bg-amber-600'"
            class="relative inline-flex h-[25px] w-[45px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:focus-visible:ring-black/75"
          >
            <span class="sr-only">Dark Mode</span>
            <span
              :class="isDarkMode ? 'translate-x-5' : 'translate-x-0 white'"
              class="flex object-contain p-[1.4px] h-full w-full shadow-lg ring-0 transform transition duration-200 ease-in-out"
              v-html="!isDarkMode ? Sun : Moon"
            >
            </span>
          </Switch>
        </div>
      </div>
    </div>
  </div>
</template>
