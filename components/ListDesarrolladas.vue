<script setup>
const supabase = useSupabaseClient();

let vacunas = ref([]);
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
    vacunas.value = data;
    console.log(data);
  } catch (err) {
    console.log("Algo salio mal cargando las vacunas: ", err);
  }
};

const deleteVacuna = async (id) => {
  try {
    const { data, error } = await supabase
      .from("vacunas_desarrolladas")
      .delete()
      .eq("id", id);

    const vac = data[0];
    vacunas.value = vacunas.value.filter((vacuna) => vacuna.id != vac.id);
  } catch (err) {
    console.log("Algo salio mal eliminando la vacuna: ", err);
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
