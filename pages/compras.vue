<script lang="ts" setup>
import CardCompra from "../components/CardCompra.vue";

useHead({
  title: "Compras",
});

const supabase = useSupabaseClient();

let vacunas = ref([]);
let vacunasDesarrolladas = ref([]);
let vacunaSelect = ref("");
let tipoCompra = ref("");

const loadVacunasDesarrolladas = async () => {
  try {
    let { data } = await supabase.from("vacunas_desarrolladas").select("*");

    data = await Promise.all(
      data.map(async (vacDesarrollada) => {
        vacDesarrollada.laboratorio_id = await loadLaboratorio(
          vacDesarrollada.laboratorio_id
        );
        vacDesarrollada.vacuna_id = await loadVacuna(vacDesarrollada.vacuna_id);
        return vacDesarrollada;
      })
    );
    vacunasDesarrolladas.value = data;
    console.log(data);
  } catch (err) {
    console.log("Algo salio mal cargando las vacunas: ", err);
  }
};

const loadVacunas = async () => {
  try {
    const { data, error } = await supabase.from("vacunas").select("*");
    vacunas.value = data;
  } catch (err) {
    console.log("Algo salio mal cargando la vacuna: ", err);
  }
};

const loadVacuna = async (id) => {
  try {
    const { data, error } = await supabase
      .from("vacunas")
      .select("*")
      .eq("id", id);
    return data[0].nombre;
  } catch (err) {
    console.log("Algo salio mal cargando la vacuna: ", err);
  }
};
const loadLaboratorio = async (id) => {
  try {
    const { data, error } = await supabase
      .from("laboratorios")
      .select("*")
      .eq("id", id);
    return data[0].nombre;
  } catch (err) {
    console.log("Algo salio mal cargando el laboratorio: ", err);
  }
};

loadVacunasDesarrolladas();
loadVacunas();
</script>

<template>
  <NuxtLayout>
    <template #page-title> Compras </template>
  </NuxtLayout>
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
    >
      <option>Comprar</option>
      <option>Pendientes</option>
      <option>Pagadas</option>
      <option>Entregadas</option>
    </select>
  </div>
  <div class="mb-4 shadow-md">
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
  <div v-if="tipoCompra == 'Comprar'">
    <CardCompra
      v-for="vacuna in vacunasDesarrolladas.filter(
        (vac) => vac.vacuna_id == vacunaSelect
      )"
      :key="vacuna.id"
      :lab="vacuna.laboratorio_id"
      :precio="vacuna.precio"
      :tiempo="vacuna.tiempo_entrega"
      :vacuna="vacuna"
    ></CardCompra>
  </div>
  <div v-if="tipoCompra != 'Comprar'">
    <p>aca van las compras pendientes y pagadas</p>
  </div>
</template>
