<script lang="ts" setup>
import { getDocs } from "../assets/crud";

useHead({
  title: "Reglas",
});
const client = useSupabaseClient();

const vacunas = ref([]);
const vacunaSelected = ref("");
const dosis = ref(0);

const result = ref({});

const chequearVacuna = async (e) => {
  const persona = {
    edad: 12,
    nroDosis: 0,
    personalSalud: "false",
    embarazada: "false",
    mesesUltimaDosis: 1,
  };

  const res = await fetch("/api/reglas", {
    method: "post",
    body: JSON.stringify({
      vacuna: vacunaSelected.value,
      persona,
      dosis: dosis.value,
    }),
  });
  result.value = await res.json();
};

(async () => {
  vacunas.value = (await getDocs(client, "vacunas")).data;
})();
</script>

<template>
  <NuxtLayout>
    <template #page-title> Reglas </template>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Seleccione una vacuna para chequear las reglas
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
        Numero de dosis
      </label>
      <input
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        id="tipo"
        placeholder="tipo"
        required
        v-model="dosis"
      />
    </div>
    <button @click="chequearVacuna">Chequear resultado</button>
    <p>Resultado: {{ result }}</p>
  </NuxtLayout>
</template>
