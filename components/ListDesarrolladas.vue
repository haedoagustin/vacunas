<script setup>
import { getDocs, getVacunasDesarrolladas } from "../assets/crud";
const client = useSupabaseClient();

let vacunas = ref([]);

const deleteVacuna = async (id) => {
  try {
    const { data, error } = await client
      .from("vacunas_desarrolladas")
      .delete()
      .eq("id", id);

    if ((error.code = "23503"))
      return alert(
        "Esta vacuna desarrolada ya tiene asociado un lote, por lo que no puede ser eliminada"
      );
    if (error) return alert("Algo salio mal eliminando la vacuna");

    const vac = data[0];
    vacunas.value = vacunas.value.filter((vacuna) => vacuna.id != vac.id);
  } catch (err) {
    console.log("Algo salio mal eliminando la vacuna: ", err);
  }
};

(async () => {
  vacunas.value = await getVacunasDesarrolladas(client);
})();
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
                  id
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Vacuna
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Laboratorio
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Vida util (dias)
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Tiempo de entrega (Dias)
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b" v-for="vacuna in vacunas">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.id }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.vacuna_id }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.laboratorio_id }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.precio }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.vida_util }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.tiempo_entrega }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  <button
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    @click="deleteVacuna(vacuna.id)"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
