<script setup>
const { error } = defineProps(["error"]);
</script>

<template>
  <div v-if="error" class="col-span-6 sm:col-span-3 mb-4">
    <div
      class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <!-- Heroicon name: outline/exclamation-triangle -->
            <svg
              class="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              class="text-lg font-medium leading-6 text-gray-900"
              id="modal-title"
            >
              ¡Atención!
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
