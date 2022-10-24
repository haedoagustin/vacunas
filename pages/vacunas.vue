<script lang="ts" setup>
import ListVacunas from "../components/ListVacunas.vue";
import FormVacunas from "../components/FormVacunas.vue";

useHead({
  title: "Vacunas",
});

const formVacuna = ref(false);
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunas </template>

    <template #page-actions>
      <PageActions v-model="formVacuna">
        <template #main-label>Nueva vacuna</template>
        <template #back-label>Volver</template>
      </PageActions>
    </template>

    <div class="flex flex-col ga-10">
      <div v-if="formVacuna" class="flex flex-col content-center w-200px" >
        <h1 class="text-2xl font-extrabold dark:text-white">
          Formulario de alta de vacunas
        </h1>
        <FormVacunas @submit-vacuna="formVacuna = true" />
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas
          </h1>
        </div>
        <ListVacunas />
      </div>
    </div>
  </NuxtLayout>
</template>
