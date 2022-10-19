<script lang="ts" setup>
import ListVacunas from "../components/ListVacunas.vue";
import FormVacunas from "../components/FormVacunas.vue";

useHead({
  title: "Vacunas",
});

const formVacuna = ref(false);

const showForm = () => {
  formVacuna.value = !formVacuna.value;
};
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunas </template>

    <div class="flex flex-col ga-10">
      <div class="flex flex-col content-center w-200px" v-if="formVacuna">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de vacunas
        </h1>
        <FormVacunas @submit-vacuna="showForm"></FormVacunas>
      </div>
      <div class="flex flex-col content-center" v-if="!formVacuna">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas
          </h1>
          <button
            @click="showForm"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Dar de alta vacuna
          </button>
        </div>
        <ListVacunas></ListVacunas>
      </div>
    </div>
  </NuxtLayout>
</template>
