<script setup>
import { getDocs } from "../assets/crud";
const client = useSupabaseClient();

let vacunas = ref([]);
let laboratorios = ref([]);
let loading = ref("false");

const vacunaDesarrollada = {
  idVacuna: ref(-1),
  idLaboratorio: ref(""),
  precio: ref(0),
  vidaUtil: ref(0),
  tiempoEntrega: ref(0),
};

const load = async () => {
  const dataVacunas = await getDocs(client, "vacunas");
  const dataLab = await getDocs(client, "laboratorios");

  vacunas.value = dataVacunas.data;
  laboratorios.value = dataLab.data;
};

const submitVacuna = async () => {
  if (loading.value) return;
  loading.value = true;
  const row = {};

  const lab = laboratorios.value.find(
    (lab) => lab.nombre == vacunaDesarrollada.idLaboratorio.value
  );
  const vac = vacunas.value.find(
    (vac) => vac.nombre == vacunaDesarrollada.idVacuna.value
  );

  row.vacuna_id = vac.id;
  row.laboratorio_id = lab.id;
  row.precio = vacunaDesarrollada.precio.value;
  row.vida_util = vacunaDesarrollada.vidaUtil.value;
  row.tiempo_entrega = vacunaDesarrollada.tiempoEntrega.value;

  console.log(row);
  try {
    const { data, error } = await client
      .from("vacunas_desarrolladas")
      .insert(row, { returning: "minimal" });

    // si la vacuna se creo correctamente cerramos el formulario
    $emit("submit-vacuna");

    console.log(error);
    loading.value = false;
  } catch (err) {
    console.log("Algo salio mal creando una vacuna:", err);
  }
};

load();
</script>

<template>
  <div class="w-full">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
      @submit="submitVacuna"
    >
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="vacuna">
          Vacuna
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="vacuna"
          id="vacuna"
          required
          v-model="vacunaDesarrollada.idVacuna.value"
        >
          <option v-for="vacuna in vacunas">
            {{ vacuna.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="laboratorio"
        >
          Laboratorio
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="laboratorio"
          id="laboratorio"
          required
          v-model="vacunaDesarrollada.idLaboratorio.value"
        >
          <option v-for="laboratorio in laboratorios">
            {{ laboratorio.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="precio">
          Precio
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="precio"
          placeholder="precio"
          required
          v-model="vacunaDesarrollada.precio.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="vida-util"
        >
          Vida util (Dias)
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="vida-util"
          placeholder="vida util"
          required
          v-model="vacunaDesarrollada.vidaUtil.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="tiempo-entrega"
        >
          Tiempo de entrega (Dias)
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="tiempo-entrega"
          placeholder="tiempo de entrega"
          required
          v-model="vacunaDesarrollada.tiempoEntrega.value"
        />
      </div>
      <button
        href="#"
        class="w-full flex justify-center inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="realizarCompra"
      >
        <LoadingSpin
          v-if="loading"
          class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
          aria-hidden="true"
        />
        <span v-if="!loading"> Crear vacuna </span>
      </button>
    </form>
  </div>
</template>
