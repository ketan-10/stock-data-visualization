<script setup lang="ts">
import { ref, computed, shallowRef, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import ChevronIcon from '@/assets/icons/chevron-up-down.svg?raw'
import { fetchStream } from '@/Constants';

const selectedCompany = ref();
const emit = defineEmits(['update'])

watch(selectedCompany, (newVal) => {
  console.log("selected Id: ", newVal.id)
  emit('update', newVal.id)
})

const companies = shallowRef([] as any[])
const isFetching = ref(true);

fetch("https://raw.githubusercontent.com/ketan-10/stock-data-visualization/master/cron/Equity.csv")
  .then(res => fetchStream(res, (data) => {
    companies.value = [...companies.value, ...data]
  }))
  .then(() => {
    isFetching.value = true;
  })


let query = ref('');

let debounceQuery = ref(query.value)
let debounceTimeout = ref();

// https://theroadtoenterprise.com/blog/how-to-create-a-debounced-ref-in-vue-3-using-composition-api 
watch(query, async (newVal) => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    debounceQuery.value = newVal
  }, 200)
})

let filteredCompany = computed(() =>
  query.value === ''
    ? companies.value.slice(0, 20)
    : debounceQuery.value === '' ? []
    : companies.value.filter((c) => {
        const q = debounceQuery.value.toLowerCase().replace(/\s+/g, '');
        return c.name.toLowerCase().replace(/\s+/g, '').includes(q) 
          || c.symbol.toLowerCase().replace(/\s+/g, '').includes(q)
      }
    ).slice(0, 20)
)

</script>

<template>
      <Combobox v-model="selectedCompany" v-bind="$attrs">
        <div class="relative mt-1">
          <div
            class="flex h-10 w-full items-center"
          >
            <ComboboxInput
              class="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed w-full"
              :displayValue="(company) => company.name"
              @change="query = $event.target.value"
            >
            </ComboboxInput>
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <div class="h-5 w-5 top-5 left-5 self-center">
                <div class="object-contain h-full w-full" v-html="ChevronIcon"></div>
              </div>
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="overflow-auto absolute z-50 mt-1 w-full max-h-60 text-base bg-popover text-popover-foreground rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm"
            >
              <div
                v-if="filteredCompany.length === 0 && query !== ''"
                class="relative cursor-default select-none px-4 py-2 text-gray-700"
              >
                Nothing found.
              </div>
  
              <ComboboxOption
                v-for="company in filteredCompany"
                as="template"
                :key="company.id"
                :value="company"
                v-slot="{ selected, active }"
              >
                <li
                  class="relative cursor-default select-none py-2 pl-10 pr-4"
                  :class="{
                    'bg-amber-600 text-amber-900': active,
                    '': !active,
                  }"
                >
                  <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                  >
                    {{ company.name }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{ 'text-white': active, 'text-amber-600': !active }"
                  >
                    <img class="h-5 w-5" src="@/assets/icons/check.svg" />
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox>
  </template>