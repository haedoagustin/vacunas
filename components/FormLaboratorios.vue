<script setup>
const supabase = useSupabaseClient();
const nombre = ref("");
let loading = ref(false);

const submitLaboratorio = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("laboratorios")
      .insert({ nombre: nombre.value }, { returning: "minimal" });

    // si el laboratorio se creo correctamente cerramos el formulario
    $emit("submit-laboratorio");
    loading.value = false;
  } catch (err) {
    console.log("Algo salio mal creando el laboratorio:", err);
  }
};
</script>

<template>
  <div class="w-full">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit="submitLaboratorio">
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre del laboratorio
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text" placeholder="nombre" id="nombre" required v-model="nombre" />
      </div>
      <button href="#"
        class="w-full flex justify-center items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="realizarCompra">
        <LoadingSpin v-if="loading" class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
          aria-hidden="true" />
        <span v-if="!loading"> Crear laboratorio </span>
      </button>
    </form>
  </div>
</template>
