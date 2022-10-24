<script lang="ts" setup>
useHead({
  title: "Vacunación"
})
const formVacunacion = ref(false);
</script>
    
<template>
  <NuxtLayout>
    <template #page-title> Vacunaciones </template>

    <template #page-actions>
      <PageActions v-model="formVacunacion">
        <template #main-label>Nueva vacunación</template>
        <template #back-label>Volver</template>
      </PageActions>
    </template>

    <div class="flex flex-col ga-10">
      <div v-if="formVacunacion" class="flex flex-col content-center">
        <h1 class="text-2xl mb-4 font-extrabold dark:text-white">
          Nueva vacunación
        </h1>
        <FormVacunacion @submit-vacunacion="formVacunacion = true" />
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas aplicadas
          </h1>
        </div>
        <ListVacunaciones />
      </div>
    </div>
  </NuxtLayout>
</template>