<script lang="ts" setup>
useHead({
  title: "Vacunación",
});

const usuario = await useUsuario();

const pending = ref(false)

const canVacunar = computed(() => usuario.rol === "vacunador");
const etl = async () => {
  pending.value = true
  try {
    let { response } = await $fetch("/api/etl", { method: "POST" });
    pending.value = false
    alert(response)
  } catch (err) {
    pending.value = false
    alert("ERROR GEENRANDO ETL: " + err);
  }
};

const finalizarVacunacion = () => {
  navigateTo("/");
};
</script>

<template>
  <NuxtLayout>
    <template #page-title> Vacunaciones </template>

    <div class="flex flex-col ga-10">
      <div v-if="canVacunar" class="flex flex-col content-center">
        <h1 class="text-2xl mb-4 font-extrabold dark:text-white">
          Nueva vacunación
        </h1>
        <FormVacunacion @submit-vacunacion="finalizarVacunacion" />
      </div>
      <div v-else class="flex flex-col content-center">
        <div class="flex justify-between">
          <h1 class="text-2xl font-extrabold dark:text-white">
            Lista de vacunas aplicadas
          </h1>

          <Loading v-if="pending" />

          <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" @click="etl">
            ETL
          </button>
        </div>
        <ListVacunaciones />
      </div>
    </div>
  </NuxtLayout>
</template>
