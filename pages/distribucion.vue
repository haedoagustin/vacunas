<script lang="ts" setup>
import { getDocs } from "../assets/crud";

useHead({
  title: "Distribución",
});
const client = useSupabaseClient();
const user = useSupabaseUser();

const vacunas = ref([]);
const vacunasDesarrolladas = ref([]);
const lotes = ref([]);
const compras = ref([]);
const envios = ref([]);
const jurisdicciones = ref([]);
const usuario = ref({});

const loading = ref(false);
const vacunaSelected = ref("");

const envio = {
  jurisdiccion_id: 0,
  cantidad: 0,
};

const getStock = () => {
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

const realizarEnvio = async (e) => {
  if (loading.value) return;
  loading.value = true;

  let envios = [];

  // obtenemos los lotes para el posible envio
  let vacunaDesarrolladaId = vacunasDesarrolladas.value
    .filter((vac) => vac.vacuna_id == vacunaSelected.value)
    .map((vac) => vac.id);

  vacunaDesarrolladaId = !vacunaDesarrolladaId.length
    ? [vacunaDesarrolladaId]
    : vacunaDesarrolladaId;
  const lotesEnvio = lotes.value.filter((lote) =>
    vacunaDesarrolladaId.includes(lote.vacuna_desarrollada_id)
  );

  // calculamos cuantos lotes tenemos que enviar
  let cantidadRestante = envio.cantidad;
  await Promise.all(
    lotesEnvio.map(async (lote) => {
      if (cantidadRestante < 0) return;

      let cantidadDisponible = lote.cantidad_disponibles;
      let cantidadEnviada = 0;

      if (cantidadDisponible > cantidadRestante) {
        cantidadDisponible -= cantidadRestante;
        cantidadEnviada = cantidadRestante;
        cantidadRestante = 0;
      } else {
        cantidadRestante -= cantidadDisponible;
        cantidadEnviada = cantidadDisponible;
        cantidadDisponible = 0;
      }
      await client
        .from("lotes")
        .update({ cantidad_disponibles: cantidadDisponible })
        .eq("id", lote.id);
      envios.push({ loteId: lote.id, cant: cantidadEnviada });
      return;
    })
  );

  // enviamos todos los lotes
  envios = envios.map((e) => {
    return {
      lote_id: e.loteId,
      jurisdiccion_id: envio.jurisdiccion_id,
      cantidad: e.cant,
      cantidad_disponible: e.cant,
      usuario_id: usuario.value,
    };
  });

  const { error } = await client.from("envios").insert(envios);
  loading.value = false;
  console.log(error);
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

  // utilizamos los lotes qe tengan stock para enviar
  console.log(lotes.value);
  lotes.value = lotes.value.filter((lote) => lote.cantidad_disponibles > 0);
  console.log(lotes.value);
  // ordenamos los lotes por fecha de vencimiento
  lotes.value.sort((lotea, loteb) => {
    const datea = new Date(lotea.fecha_vencimiento).getTime();
    const dateb = new Date(loteb.fecha_vencimiento).getTime();

    if (datea < dateb) return -1;
    if (dateb < datea) return 1;
    return 0;
  });

  console.log(lotes.value);
  loading.value = false;
})();
</script>

<template>
  <NuxtLayout>
    <template #page-title> Distribución </template>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Seleccione una vacuna para realizar el envio
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
    <div v-if="vacunaSelected">
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Stock actual: {{ getStock() }}
      </p>
    </div>
    <form
      v-if="vacunaSelected && getStock() != 0"
      @submit.prevent="realizarEnvio"
    >
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="jurisdiccion"
        >
          Jurisdiccion
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="jurisdiccion"
          id="jurisdiccion"
          required
          v-model="envio.jurisdiccion_id"
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
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="cantidad"
        >
          Cantidad a enviar
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="cantidad"
          placeholder="cantidad"
          required
          v-model="envio.cantidad"
        />
      </div>
      <button
        href="#"
        class="w-full flex justify-center inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <LoadingSpin
          v-if="loading"
          class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
          aria-hidden="true"
        />
        <span v-if="!loading"> Realizar envio </span>
      </button>
    </form>
  </NuxtLayout>
</template>
