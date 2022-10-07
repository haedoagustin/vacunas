<script lang="ts" setup>
import ListVacunas from "../components/ListVacunas.vue";
import FormVacunas from "../components/FormVacunas.vue";

useHead({
  title: "Vacunas",
});
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunas </template>

    <div class="flex gap-10">
      <div class="flex flex-col content-center">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de vacunas
        </h1>
        <FormVacunas></FormVacunas>
      </div>
      <div class="flex flex-col content-center">
        <h1 class="text-2xl font-extrabold dark:text-white">
          Lista de vacunas
        </h1>
        <ListVacunas></ListVacunas>
      </div>
    </div>
  </NuxtLayout>
</template>
