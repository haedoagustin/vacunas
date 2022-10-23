<script setup>
const supabase = useSupabaseClient();

const deleteUsuario = async(user_id) => {
    try {
        let{ data, error } = await useFetch('/api/delete_user?user_id=' + user_id)

        alert('usuario eliminado con éxito')
        loadUsuarios()
    } catch (err) {
    console.log("Algo salio mal eliminando el usuario: ", err);
  }
}


let usuarios = ref([]);
const loadUsuarios = async () => {
  try {
    let { data } = await supabase.from("usuarios")
        .select(`id, nombre, apellido,rol, jurisdiccion(nombre)`);
    usuarios.value = data;
  } catch (err) {
    console.log("Algo salio mal cargando los usuarios: ", err);
  }
};
loadUsuarios();
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
                    Apellido
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Rol
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Jurisdicción
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
                <tr class="border-b" v-for="usuario in usuarios">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ usuario.id }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ usuario.nombre }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ usuario.apellido }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ usuario.rol }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ usuario.jurisdiccion.nombre }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    <button
                      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      @click="deleteUsuario(usuario.id)"
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