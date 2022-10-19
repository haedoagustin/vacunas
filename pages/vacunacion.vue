<script lang="ts" setup>
useHead({
  title: "Vacunación"
})
const formVacunacion = ref(false);

const showForm = () => formVacunacion.value = !formVacunacion.value;;
</script>
    
<template>
  <NuxtLayout>
    <template #page-title> Vacunas aplicadas </template>

    <div class="flex flex-col ga-10">
      <div v-if="formVacunacion" class="flex flex-col content-center">
        <h1 class="text-2xl mb-4 font-extrabold dark:text-white">
          Nueva vacunación
        </h1>
        <FormVacunacion @submit-vacunacion="showForm"></FormVacunacion>
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas aplicadas
          </h1>
          <button @click="showForm" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Nueva vacunación
          </button>
        </div>
        <ListVacunaciones></ListVacunaciones>
      </div>
    </div>
  </NuxtLayout>
</template>