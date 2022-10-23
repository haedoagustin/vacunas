<script lang="ts" setup>
import { getDocs } from "../assets/crud";
import ListSotck from "../components/ListStock.vue";

useHead({
  title: "Stocks",
});
const client = useSupabaseClient();
const user = useSupabaseUser();

const jurisdicciones = ref([]);
const envios = ref([]);
const vacunas = ref([]);
const vacunasDesarrolladas = ref([]);
const lotes = ref([]);
const compras = ref([]);
const usuario = ref({});

const vacunaSelected = ref("");
const consultaSelected = ref(false);
const jurisdiccionSelected = ref("");
const loading = ref(false);
const showList = ref(false);

const getStockNacional = () => {
  let vacunaDesarrolladaId = vacunasDesarrolladas.value
    .filter((vac) => vac.vacuna_id == vacunaSelected.value)
    .map((vac) => vac.id);

  vacunaDesarrolladaId = !vacunaDesarrolladaId.length
    ? [vacunaDesarrolladaId]
    : vacunaDesarrolladaId;

  const stock = lotes.value
    .filter(
      (lote) =>
        vacunaDesarrolladaId.includes(lote.vacuna_desarrollada_id) &&
        !lote.vencido
    )
    .map((lote) => lote.cantidad_disponibles)
    .reduce((cantAnterior, cantActual) => cantAnterior + cantActual, 0);

  return stock;
};

const getStockJuridisccional = () => {
  let vacunaDesarrolladaId = vacunasDesarrolladas.value
    .filter((vac) => vac.vacuna_id == vacunaSelected.value)
    .map((vac) => vac.id);

  vacunaDesarrolladaId = !vacunaDesarrolladaId.length
    ? [vacunaDesarrolladaId]
    : vacunaDesarrolladaId;

  const stock = envios.value
    .filter((envio) => envio.jurisdiccion_id == jurisdiccionSelected.value)
    .map((envio) => {
      envio.lote = lotes.value.find((lote) => lote.id == envio.lote_id);
      return envio;
    })
    .filter(
      (envio) =>
        vacunaDesarrolladaId.includes(envio.lote.vacuna_desarrollada_id) &&
        !envio.lote.vencido
    )
    .map((envio) => envio.cantidad_disponible)
    .reduce((cantAnterior, cantActual) => cantAnterior + cantActual, 0);

  return stock;
};

(async () => {
  loading.value = true;
  const usuarios = await getDocs(client, "usuarios", {
    column: "auth_user_id",
    value: user.value.id,
  });

  usuario.value = usuarios.data[0].id;
  vacunas.value = (await getDocs(client, "vacunas")).data;
  vacunasDesarrolladas.value = (
    await getDocs(client, "vacunas_desarrolladas")
  ).data;
  compras.value = (await getDocs(client, "compras")).data;
  lotes.value = (await getDocs(client, "lotes")).data;
  envios.value = (await getDocs(client, "envios")).data;
  jurisdicciones.value = (await getDocs(client, "jurisdicciones")).data;

  // utilizamos solo los lotes que pertenescan a una compra finalizada
  lotes.value = lotes.value.filter((lote) => {
    const compra = compras.value.find((compra) => compra.id == lote.compra_id);
    return compra.estado === "entregada";
  });

  loading.value = false;
})();
</script>

<template>
  <NuxtLayout>
    <template #page-title> Stock </template>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Seleccione una vacuna para consultar su stock
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="vacunaSelected"
      >
        <option v-for="vacuna in vacunas" :key="vacuna.id" :value="vacuna.id">
          {{ vacuna.nombre }}
        </option>
      </select>
    </div>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Consulta nacional o juridisccional
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="consultaSelected"
      >
        <option :value="false">Nacional</option>
        <option :value="true">Provincial</option>
      </select>
    </div>
    <div v-if="vacunaSelected && !consultaSelected">
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Stock actual: {{ getStockNacional() }}
      </p>
    </div>
    <div class="mb-4 shadow-md" v-if="consultaSelected">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Seleccione una jurisdiccion
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="jurisdiccionSelected"
      >
        <option
          v-for="jurisdiccion in jurisdicciones"
          :key="jurisdiccion.id"
          :value="jurisdiccion.id"
        >
          {{ jurisdiccion.nombre }}
        </option>
      </select>
    </div>
    <div v-if="vacunaSelected && consultaSelected">
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Stock actual: {{ getStockJuridisccional() }}
      </p>
    </div>
    <button
      href="#"
      class="w-full flex justify-center inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      v-if="vacunaSelected"
      @click="
        () => {
          showList = true;
        }
      "
    >
      <LoadingSpin
        v-if="loading"
        class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
        aria-hidden="true"
      />
      <span v-if="!loading"> Mostrar Lista detallada </span>
    </button>
    <ListStock
      v-if="showList && consultaSelected"
      :vacuna="vacunaSelected"
      :jurisdiccion="jurisdiccionSelected"
    ></ListStock>
    <ListStock
      v-if="showList && !consultaSelected"
      :vacuna="vacunaSelected"
      :jurisdiccion="false"
    ></ListStock>
  </NuxtLayout>
</template>
