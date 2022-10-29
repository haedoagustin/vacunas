<script setup>
const supabase = useSupabaseClient();

let laboratorios = ref([]);
const loadLaboratorios = async () => {
  try {
    let { data } = await supabase.from("laboratorios").select("*");
    laboratorios.value = data;
    console.log(data);
  } catch (err) {
    console.log("Algo salio mal cargando las laboratorios: ", err);
  }
};

const deleteLaboratorio = async (id) => {
  try {
    const { data, error } = await supabase
      .from("laboratorios")
      .delete()
      .eq("id", id);

    if ((error.code = "23503"))
      return alert(
        "El laboratorio no puede ser elimianada ya que esta asociado a una vacuna desarrollada"
      );
    if (error) return alert("Algo salio mal eliminando el laboratorio");

    const lab = data[0];
    laboratorios.value = laboratorios.value.filter(
      (laboratorio) => laboratorio.id != lab.id
    );
  } catch (err) {
    console.log("Algo salio mal eliminando la laboratorio: ", err);
  }
};

loadLaboratorios();
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b" v-for="laboratorio in laboratorios">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ laboratorio.id }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ laboratorio.nombre }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  <button
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    @click="deleteLaboratorio(laboratorio.id)"
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
