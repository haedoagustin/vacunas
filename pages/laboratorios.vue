<script lang="ts" setup>
import ListLaboratorios from "../components/ListLaboratorios.vue";
import FormLaboratorios from "../components/FormLaboratorios.vue";

useHead({
  title: "Laboratorios",
});
const formLaboratorio = ref(false);

const showForm = () => {
  formLaboratorio.value = !formLaboratorio.value;
};
</script>

<template>
  <NuxtLayout>
    <template #page-title> Laboratorios </template>

    <div class="flex flex-col ga-10">
      <div class="flex flex-col content-center w-200px" v-if="formLaboratorio">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de laboratorios
        </h1>
        <FormLaboratorios @submit-laboratorio="showForm"></FormLaboratorios>
      </div>
      <div class="flex flex-col content-center" v-if="!formLaboratorio">
        <div class="flex justify-between gap-12">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de laboratorios
          </h1>
          <button
            @click="showForm"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Dar de alta laboratorio
          </button>
        </div>
        <ListLaboratorios></ListLaboratorios>
      </div>
    </div>
  </NuxtLayout>
</template>

<!-- <template>
  <NuxtLayout>
    <template #page-title> Laboratorios </template>

    <div class="flex gap-10">
      <div class="flex flex-col content-center">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de laboratorio
        </h1>
        <FormLaboratorios></FormLaboratorios>
      </div>
      <div class="flex flex-col content-center">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Lista de laboratorios
        </h1>
        <ListLaboratorios></ListLaboratorios>
      </div>
    </div>
  </NuxtLayout>
</template> -->
