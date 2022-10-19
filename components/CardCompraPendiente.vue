<script setup>
import { getDocs } from "../assets/crud";
const props = defineProps(["compra"]);
const client = useSupabaseClient();

let vacuna = ref("");
let cantidad = ref("");
let desarrollador = ref("");
let loaded = ref(false);
const loading = ref(false);

const actualizarEstado = async (e) => {
  if (loading.value) return;
  loading.value = true;
  const { data, error } = await client
    .from("compras")
    .update({
      estado: props.compra.estado == "pendiente" ? "pagada" : "entregada",
    })
    .eq("id", props.compra.id);
  loading.value = false;
};

(async () => {
  const lote = await getDocs(client, "lotes", {
    column: "compra_id",
    value: props.compra.id,
  });
  const vacunaD = await getDocs(client, "vacunas_desarrolladas", {
    column: "id",
    value: lote.data[0].vacuna_desarrollada_id,
  });
  const lab = await getDocs(client, "laboratorios", {
    column: "id",
    value: vacunaD.data[0].laboratorio_id,
  });
  const vac = await getDocs(client, "vacunas", {
    column: "id",
    value: vacunaD.data[0].vacuna_id,
  });

  vacuna.value = vac.data[0].nombre;
  desarrollador.value = lab.data[0].nombre;
  cantidad.value = lote.data[0].cantidad;
  loaded.value = true;
})();
</script>

<template>
  <button
    class="w-full flex justify-center inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    v-if="!loaded"
  >
    <LoadingSpin
      class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
      aria-hidden="true"
    />
  </button>
  <div
    class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    v-if="loaded"
  >
    <a href="#">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Vacuna: {{ vacuna }}
      </h5>
    </a>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Desarrollador: {{ desarrollador }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Fecha de entrega: {{ props.compra.fecha_entrega }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Cantidad: {{ cantidad }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Estado: {{ props.compra.estado }}
    </p>
    <a
      href="#"
      class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      @click="actualizarEstado"
      v-if="props.compra.estado != 'entregada'"
    >
      <LoadingSpin
        v-if="loading"
        class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
        aria-hidden="true"
      />
      <span v-if="!loading">
        {{ props.compra.estado == "pendiente" ? "pagar" : "entregada" }}</span
      >
    </a>
  </div>
</template>
