<script lang="ts" setup>
import ListLaboratorios from "../components/ListLaboratorios.vue";
import FormLaboratorios from "../components/FormLaboratorios.vue";

useHead({
  title: "Laboratorios",
});
const formLaboratorio = ref(false);
</script>

<template>
  <NuxtLayout>
    <template #page-title> Laboratorios </template>

    <template #page-actions>
      <PageActions v-model="formLaboratorio">
        <template #main-label>Nuevo laboratorio</template>
        <template #back-label>Volver</template>
      </PageActions>
    </template>

    <div class="flex flex-col ga-10">
      <div v-if="formLaboratorio" class="flex flex-col content-center w-200px">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de laboratorios
        </h1>
        <FormLaboratorios @submit-laboratorio="formLaboratorio = true" />
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between gap-12">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de laboratorios
          </h1>
        </div>
        <ListLaboratorios />
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
