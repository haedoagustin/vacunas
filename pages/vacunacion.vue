<script lang="ts" setup>
useHead({
  title: "Vacunación",
});

const usuario = await useUsuario();

const canVacunar = computed(() => usuario.rol === "vacunador");
const loading = ref(false);
const etl = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    await fetch("/api/etl", { method: "POST" });
    loading.value = false;
  } catch (err) {
    console.log("ERROR GEENRANDO ETL: ", err);
    loading.value = false;
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
          <button
            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            @click="etl"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <LoadingSpin
                v-if="loading"
                class="animate-spin h-5 w-5 text-blue-500 group-hover:text-blue-400"
                aria-hidden="true"
              />
            </span>
            <p v-if="!loading">ETL</p>
          </button>
        </div>
        <ListVacunaciones />
      </div>
    </div>
  </NuxtLayout>
</template>
