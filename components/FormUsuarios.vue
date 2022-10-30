<script setup>
const client = useSupabaseClient();
const emit = defineEmits(['submit-usuario'])
const usuario = {
  nombre: ref(""),
  apellido: ref(""),
  rol: ref(null),
  jurisdiccion: ref(null),
  email: ref(""),
  password: ref("")
};
let loading = ref(false);

let jurisdicciones = ref([]);
const loadJurisdicciones = async () => {
  try {
    let { data } = await client.from("jurisdicciones").select("*");
    jurisdicciones.value = data;
  } catch (err) {
    console.log("Algo salio mal cargando las jurisdicciones: ", err);
  }
};

const submitForm = async () =>{
    if (loading.value) return;
    loading.value = true;
    const formData = {};

    try {
        formData.nombre = usuario.nombre.value
        formData.apellido = usuario.apellido.value
        formData.rol = usuario.rol.value
        formData.jurisdiccion = usuario.jurisdiccion.value
        formData.email = usuario.email.value
        formData.password = usuario.password.value

        const { data, error } = await useFetch('/api/users', {
            'method': 'POST',
            body: formData
        })

        emit("submit-usuario", data);
        loading.value = false;
    } catch (err) {
        console.log("Algo salio mal creando el usuario:", err);
    }

}

loadJurisdicciones()
</script>

<template>
  <div class="w-full">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
      @submit.prevent="submitForm"
    >
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Email
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="test@gmail.com"
          id="email"
          required
          v-model="usuario.email.value"
        />
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="password"
          id="password"
          required
          v-model="usuario.password.value"
        />
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="nombre"
          id="nombre"
          required
          v-model="usuario.nombre.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Apellido
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="apellido"
          id="nombre"
          required
          v-model="usuario.apellido.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
          Rol
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="tipo"
          placeholder="tipo"
          required
          v-model="usuario.rol.value"
        >
          <option value="admin">Administrador</option>
          <option value="operador nacional">Operador Nacional</option>
          <option value="vacunador">Vacunador</option>
          <option value="analista provincial">Analista Provincial</option>
        </select>
      </div>
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
          Jurisdicción
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rol"
          placeholder="rol"
          required
          v-model="usuario.jurisdiccion.value"
        >
         <option v-for="jurisdiccion in jurisdicciones" :value="jurisdiccion.id">
            {{ jurisdiccion.nombre }}
          </option>
        </select>
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
        <span v-if="!loading"> Crear Usuario </span>
      </button>
    </form>
  </div>
</template>
