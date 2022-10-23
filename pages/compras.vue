<script lang="ts" setup>
import { getDocs, getVacunasDesarrolladas } from "../assets/crud";
import CardCompra from "../components/CardCompra.vue";
import CardCompraPendiente from "../components/CardCompraPendiente.vue";

useHead({
  title: "Compras",
});

const client = useSupabaseClient();

let vacunas = ref([]);
let vacunasDesarrolladas = ref([]);
let compras = ref([]);

let vacunaSelect = ref("");
let tipoCompra = ref("");

(async () => {
  vacunasDesarrolladas.value = await getVacunasDesarrolladas(client);
  vacunas.value = (await getDocs(client, "vacunas")).data;
  compras.value = (await getDocs(client, "compras")).data;
})();

const show = () => {
  console.log("hola");
};
</script>

<template>
  <NuxtLayout>
    <template #page-title> Compras </template>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Funciones de compra
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="tipoCompra"
        @change="show"
      >
        <option value="Comprar">Comprar</option>
        <option value="pendiente">Pendientes</option>
        <option value="pagada">Pagadas</option>
        <option value="entregada">Entregadas</option>
      </select>
    </div>
    <div class="mb-4 shadow-md" v-if="tipoCompra == 'Comprar'">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Vacuna
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="vacunaSelect"
      >
        <option v-for="vacuna in vacunas">{{ vacuna.nombre }}</option>
      </select>
    </div>
    <div v-if="tipoCompra == 'Comprar'" class="grid grid-cols-4">
      <CardCompra
        v-for="vacuna in vacunasDesarrolladas.filter(
          (vac) => vac.vacuna_id == vacunaSelect
        )"
        :key="vacuna.id"
        :vacuna="vacuna"
      ></CardCompra>
    </div>
    <div v-if="tipoCompra != 'Comprar'" class="grid grid-cols-4 gap-12">
      <CardCompraPendiente
        v-for="compra in compras.filter(
          (compra) => compra.estado == tipoCompra
        )"
        :key="compra.id"
        :compra="compra"
      ></CardCompraPendiente>
      <div
        v-if="
          tipoCompra &&
          tipoCompra != 'Comprar' &&
          compras.filter((compra) => compra.estado == tipoCompra).length == 0
        "
      >
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Actualmente no hay ninguna compra {{ tipoCompra }}
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
