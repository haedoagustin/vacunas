<script setup>
import { getEdad } from "../assets/crud";
const { dni, buttonClass } = defineProps(['dni', 'buttonClass'])
const show = ref(false)
const ciudadano = ref({})

const { data, pending, refresh, error } = await useLazyFetch("/api/persona", { query: { dni }, key: `dni:${dni}` });

watch(data, () => {
  ciudadano.value = data.value
})

watch(show, () => {
  if (show.value) {
    refresh()
  }
})
</script>

<template>
  <a href="#" @click="show=true" :class="buttonClass">
    <slot></slot>
  </a>

  <div v-if="show" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

        <div v-if="pending" class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <LoadingSpin class="animate-spin h-10 w-10 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
              aria-hidden="true" />
          </div>
        </div>

        <div v-else
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

          <button type="button" @click="show=false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div v-if="ciudadano" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>

              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Datos del ciudadano
                </h3>
                <div class="mt-2">
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    DNI: <span class="font-medium">{{ ciudadano.DNI }}</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Apellido: <span class="font-medium">{{ ciudadano.apellido }}</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Nombre: <span class="font-medium">{{ ciudadano.nombre }}</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Genero: <span class="font-medium">{{ ciudadano.genero }}</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Jurisdicción: <span class="font-medium">{{ ciudadano.jurisdiccion }}</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Fecha y hora de nacimiento: <span class="font-medium">{{ ciudadano.fecha_hora_nacimiento }} ({{
                    getEdad(ciudadano.fecha_hora_nacimiento) }} años)</span>
                  </p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    ¿Es personal de salud?: <span class="font-medium">{{ ciudadano.personal_salud ? 'Si' : 'No'
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="error" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Error
                </h3>
                <div class="mt-2">
                  <p class="text-red-500 text-xs italic">{{ error.data.message }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
