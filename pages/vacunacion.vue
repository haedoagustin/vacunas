<script lang="ts" setup>
useHead({
  title: "Vacunación"
})

const usuario = await useUsuario()

const canVacunar = computed(() => usuario.rol === 'vacunador')

</script>
    
<template>
  <NuxtLayout>
    <template #page-title> Vacunaciones </template>

    <div class="flex flex-col ga-10">
      <div v-if="canVacunar" class="flex flex-col content-center">
        <h1 class="text-2xl mb-4 font-extrabold dark:text-white">
          Nueva vacunación
        </h1>
        <FormVacunacion />
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