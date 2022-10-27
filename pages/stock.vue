<script setup>
import { getDocs } from "../assets/crud";
import ListStock from "../components/ListStock.vue";
const usuario = await useUsuario();
const client = useSupabaseClient();

const vacunas = ref([]);
let vacunaSelected = ref(0);

const selectVacuna = () => {
  console.log(vacunaSelected.value);
};

(async () => {
  vacunas.value = (await getDocs(client, "vacunas")).data;
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
        id="tipo"
        placeholder="tipo"
        required
        v-model="vacunaSelected"
        @change="selectVacuna"
      >
        <option v-for="vacuna in vacunas" :key="vacuna.id" :value="vacuna.id">
          {{ vacuna.nombre }}
        </option>
      </select>
    </div>
    <div v-if="vacunaSelected && usuario.rol == 'operador nacional'">
      <p>Stock de la nacion</p>
      <ListStock :vacuna="vacunaSelected" :jurisdiccion="false"></ListStock>
    </div>

    <div v-if="vacunaSelected && usuario.rol == 'analista provincial'">
      <p>Stock de la provincia de {{ usuario.jurisdiccion.nombre }}</p>
      <ListStock
        v-if="vacunaSelected"
        :vacuna="vacunaSelected"
        :jurisdiccion="jurisdiccionSelected"
      ></ListStock>
    </div>
  </NuxtLayout>
</template>
