<script setup>
import { getDocs } from "../assets/crud";
const props = defineProps(["vacuna", "jurisdiccion"]);
const client = useSupabaseClient();
const loading = ref(false);
const cantidadVacuna = ref([]);

const loadCantidad = async () => {
  loading.value = true;
  const vacunasDesarrolladas = (await getDocs(client, "vacunas_desarrolladas"))
    .data;
  const compras = (await getDocs(client, "compras")).data;
  let lotes = (await getDocs(client, "lotes")).data;
  const envios = (await getDocs(client, "envios")).data;
  // utilizamos solo los lotes que pertenescan a una compra finalizada
  lotes = lotes.filter((lote) => {
    const compra = compras.find((compra) => compra.id == lote.compra_id);
    return compra?.estado === "entregada";
  });

  console.log(lotes);
  // cargamos todas las vacunas con sus cantidades
  if (!props.jurisdiccion) {
    // si es nacional
    cantidadVacuna.value = lotes
      .filter((lote) => {
        const vacunaDesarrollada = vacunasDesarrolladas.find(
          (vac) => vac.id == lote.vacuna_desarrollada_id
        );
        return (
          vacunaDesarrollada.vacuna_id == props.vacuna &&
          lote.cantidad_disponibles > 0
        );
      })
      .map((lote) => {
        return {
          lote: lote.id,
          cantidad: lote.cantidad_disponibles,
          vencimiento: lote.fecha_vencimiento,
        };
      });
  } else {
    // si es provincial
    cantidadVacuna.value = envios
      .filter((envio) => {
        const lote = lotes.find((lote) => lote.id == envio.lote_id);
        const vacunaDesarrollada = vacunasDesarrolladas.find(
          (vac) => vac.id == lote.vacuna_desarrollada_id
        );
        return (
          envio.jurisdiccion_id == props.jurisdiccion &&
          envio.cantidad_disponible > 0 &&
          vacunaDesarrollada.vacuna_id == props.vacuna
        );
      })
      .map((envio) => {
        const lote = lotes.find((lote) => lote.id == envio.lote_id);
        return {
          lote: envio.lote_id,
          cantidad: envio.cantidad_disponible,
          vencimiento: lote.fecha_vencimiento,
        };
      });
  }

  loading.value = false;
};

watch(
  () => props.vacuna,
  () => {
    loadCantidad();
  }
);

loadCantidad();
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full">
            <thead class="border-b">
              <tr>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Nro de Lote
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Cantidad
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Fecha de vencimiento
                </th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr
                class="border-b"
                v-for="cantidad in cantidadVacuna.sort((lotea, loteb) => {
                  const datea = new Date(lotea.vencimiento).getTime();
                  const dateb = new Date(loteb.vencimiento).getTime();
                  if (datea < dateb) return -1;
                  if (dateb < datea) return 1;
                  return 0;
                })"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ cantidad.lote }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ cantidad.cantidad }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ cantidad.vencimiento }}
                </td>
              </tr>
            </tbody>
          </table>
          <p
            v-if="!loading && cantidadVacuna.length == 0"
            class="flex justify-center w-full"
          >
            No hay stock de esta vacuna actualmente
          </p>
          <div v-if="loading" class="flex justify-center w-full">
            <svg
              viewBox="0 0 38 38"
              stroke="rgb(99, 102, 241)"
              class="animate-spin h-10 w-10 text-indigo-500 color-indigo-600 group-hover:text-indigo-400 cursor-wait"
            >
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                  <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
