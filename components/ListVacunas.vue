<script setup>
const supabase = useSupabaseClient();

let vacunas = ref([]);
const loadVacunas = async () => {
  try {
    let { data } = await supabase.from("vacunas").select("*");
    vacunas.value = data;
  } catch (err) {
    console.log("Algo salio mal cargando las vacunas: ", err);
  }
};

const deleteVacuna = async (id) => {
  try {
    const { data, error } = await supabase
      .from("vacunas")
      .delete()
      .eq("id", id);

    const vac = data[0];
    vacunas.value = vacunas.value.filter((vacuna) => vacuna.id != vac.id);
  } catch (err) {
    console.log("Algo salio mal eliminando la vacuna: ", err);
  }
};

loadVacunas();
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
                  Nombre
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Intervalo
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Fecha de inicio
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Fecha de fin
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
                  {{ vacuna.nombre }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.tipo }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.intervalo }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.fecha_inicio }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ vacuna.fecha_fin }}
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
