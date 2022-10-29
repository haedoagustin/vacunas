<script lang="ts" setup>
import ListDesarrolladas from "../components/ListDesarrolladas.vue";
import FormDesarrolladas from "../components/FormDesarrolladas.vue";

useHead({
  title: "Vacunas desarrolladas",
});
const formVacuna = ref(false);
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunas desarrolladas </template>

    <template #page-actions>
      <PageActions v-model="formVacuna">
        <template #main-label>Nueva vacuna desarrollada</template>
        <template #back-label>Volver</template>
      </PageActions>
    </template>

    <div class="flex flex-col ga-10">
      <div v-if="formVacuna" class="flex flex-col content-center w-200px" >
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de vacunas desarrolladas
        </h1>
        <FormDesarrolladas @submit-vacuna="formVacuna = true" />
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas desarrolladas
          </h1>
        </div>
        <ListDesarrolladas />
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
