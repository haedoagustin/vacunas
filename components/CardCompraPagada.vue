<script setup>
const { compra } = defineProps(["compra"]);
const emit = defineEmits(["entrega-compra"])

const lote = compra.lotes[0];

const loading = ref(false);
const error = ref()

const entregarCompra = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let compra_updated = await $fetch('/api/compra', {
      method: 'put', body: {
        compra,
        updated_data: {
          estado: "entregada"
        }
      }
    })
    let lote_updated = await $fetch('/api/lote', {
      method: 'put', body: {
        lote,
        updated_data: {
          cantidad_disponibles: lote.cantidad
        }
      }
    })
    if (lote_updated) emit("entrega-compra")
  } catch (e) {
    error.value = e
  }
  loading.value = false;
};
</script>

<template>
  <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Vacuna: {{ lote.vacuna_desarrollada_id.vacuna_id.nombre }}
      </h5>
    </a>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Desarrollador: {{ lote.vacuna_desarrollada_id.laboratorio_id.nombre }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Fecha de la compra: {{ new Date(compra.created_at).toLocaleDateString() }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Fecha de entrega: {{ compra.fecha_entrega }}
    </p>
    <button @click="entregarCompra"
      class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <LoadingSpin v-if="loading" class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
        aria-hidden="true" />
      Entregar compra
    </button>

    <ErrorAlert v-if="error" :error="error" />
  </div>
</template>
