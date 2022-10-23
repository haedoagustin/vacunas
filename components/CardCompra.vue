<script setup>
import { getDocs } from "../assets/crud";
const props = defineProps(["vacuna"]);
const client = useSupabaseClient();
const user = useSupabaseUser();

const cantidad = ref(0);
const loading = ref(false);

const realizarCompra = async (e) => {
  if (loading.value) return;
  loading.value = true;
  const row = {};
  const date = new Date();
  date.setDate(date.getDate() + props.vacuna.tiempo_entrega);

  const usuarios = await getDocs(client, "usuarios", {
    column: "auth_user_id",
    value: user.value.id,
  });

  row.usuario_id = usuarios.data[0].id;
  row.fecha_entrega = date;
  row.estado = "pendiente";

  const rowLote = {};
  const dateVencimiento = new Date();
  dateVencimiento.setDate(dateVencimiento.getDate() + props.vacuna.vida_util);
  rowLote.vacuna_desarrollada_id = props.vacuna.id;
  rowLote.cantidad = cantidad.value;
  rowLote.cantidad_disponibles = cantidad.value;
  rowLote.fecha_vencimiento = dateVencimiento;

  try {
    const { data, error } = await client.from("compras").insert(row);
    rowLote.compra_id = data[0].id;
    await client.from("lotes").insert(rowLote);
    loading.value = false;
    location.reload();
  } catch (err) {
    alert("Algo salio mal realizando la compra");
    console.log("Algo salio mal realizando la compra:", err);
  }
};
</script>

<template>
  <div
    class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
  >
    <a href="#">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Desarrollador: {{ props.vacuna.laboratorio_id }}
      </h5>
    </a>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Precio: {{ props.vacuna.precio }}
    </p>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Tiempo de entrega: {{ props.vacuna.tiempo_entrega }} (Dias)
    </p>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="cant">
        Cantidad
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        placeholder="cantidad"
        id="cant"
        required
        v-model="cantidad"
      />
    </div>
    <a
      href="#"
      class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      @click="realizarCompra"
    >
      <LoadingSpin
        v-if="loading"
        class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
        aria-hidden="true"
      />
      <span v-if="!loading"> Comprar </span>
    </a>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Total: {{ cantidad * props.vacuna.precio }}
    </p>
  </div>
</template>
