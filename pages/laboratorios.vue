<script lang="ts" setup>
import ListLaboratorios from "../components/ListLaboratorios.vue";
import FormLaboratorios from "../components/FormLaboratorios.vue";

useHead({
  title: "Laboratorios",
});
</script>

<template>
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
</template>
