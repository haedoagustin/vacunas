<script lang="ts" setup>
import ListDesarrolladas from "../components/ListDesarrolladas.vue";
import FormDesarrolladas from "../components/FormDesarrolladas.vue";

useHead({
  title: "Vacunas desarrolladas",
});
const formVacuna = ref(false);

const showForm = () => {
  formVacuna.value = !formVacuna.value;
};
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunas desarrolladas </template>

    <div class="flex flex-col ga-10">
      <div class="flex flex-col content-center w-200px" v-if="formVacuna">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de vacunas desarrolladas
        </h1>
        <FormDesarrolladas @submit-vacuna="showForm"></FormDesarrolladas>
      </div>
      <div class="flex flex-col content-center" v-if="!formVacuna">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas desarrolladas
          </h1>
          <button
            @click="showForm"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Dar de alta vacuna desarrollada
          </button>
        </div>
        <ListDesarrolladas></ListDesarrolladas>
      </div>
    </div>
  </NuxtLayout>
</template>

<!-- <template>
  <NuxtLayout>
    <template #page-title> Vacunas desarrolladas </template>

    <div class="flex gap-10">
      <div class="flex flex-col content-center">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Formulario de alta de vacuna desarrollada
          </h1>
          <FormDesarrolladas></FormDesarrolladas>
      </div>
      <div class="flex flex-col content-center">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Lista de vacunas desarrolladas
        </h1>
        <ListDesarrolladas></ListDesarrolladas>
      </div>
    </div>
  </NuxtLayout>
</template> -->
