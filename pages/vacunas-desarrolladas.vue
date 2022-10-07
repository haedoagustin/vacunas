<script lang="ts" setup>
import ListDesarrolladas from "../components/ListDesarrolladas.vue";
import FormDesarrolladas from "../components/FormDesarrolladas.vue";

useHead({
  title: "Vacunas desarrolladas",
});
</script>

<template>
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
</template>
