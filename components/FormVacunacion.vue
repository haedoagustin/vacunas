<script setup>
import { getEdad, getDocs, getUsuario, getDatosDosis, getVacunasDesarrolladasByVacunaId, getEnviosParaVacunacion, postVacunacion } from "../assets/crud";
const client = useSupabaseClient();

const emit = defineEmits(['update:submit-vacunacion'])

const ciudadano = ref();
const vacuna = ref()
const vacunas_desarrolladas = ref()
const vacuna_desarrollada = ref()
const envios = ref()
const envio = ref()
const error = ref()
// const dosis = reactive({ ultima: null, cantidad: null })

const loading = ref(false);

const { data: vacunas } = await getDocs(client, 'vacunas')

watch(vacuna, async () => {
  if (vacuna.value) {
    let { data } = await getVacunasDesarrolladasByVacunaId(client, vacuna.value.id)
    vacunas_desarrolladas.value = data
  }
})

watch(vacuna_desarrollada, async () => {
  if (vacuna_desarrollada.value) {
    const { data, error: errorValue } = await getEnviosParaVacunacion(client, vacuna_desarrollada.value.id)
    if (errorValue) {
      error.value = errorValue
    } else {
      envios.value = data;
    }
  }
})

// watch(envio, async () => {
//   if (envio.value) {
//     const { ultima_dosis, cantidad_dosis, error: errorValue } = await getDatosDosis(client, vacuna_desarrollada.value.id, ciudadano.value.DNI)
//     if (errorValue) {
//       error.value = errorValue
//     } else {
//       dosis.ultima = ultima_dosis
//       dosis.cantidad = cantidad_dosis
//     }
//   }
// })

const registrarVacunacion = async () => {

  if (loading.value) return;
  loading.value = true;
  let usuario = await getUsuario(client);

  try {
    const data = await postVacunacion(client, {
      vacunador: usuario.id,
      dni_vacunado: ciudadano.value?.DNI,
      envio_id: envio.value?.id
    })

    loading.value = false;
    emit("submit-vacunacion", data);

  } catch (e) {
    error.value = e
    loading.value = false;
  }
}
</script>

<template>
  <Loading v-if="loading" />

  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="flex flex-col mt-2">
      <div class="flex justify-between">
        <FormCiudadano v-model="ciudadano" />
        <ModalCiudadano v-if="ciudadano" :dni="ciudadano.DNI"
          buttonClass="mt-auto mb-6 ml-2 font-medium text-green-600 hover:text-green-500">
          Ver datos
        </ModalCiudadano>
      </div>
    </div>

    <form v-if="ciudadano" @submit="registrarVacunacion">

      <div class="col-span-6 sm:col-span-3 mb-4">
        <label for="vacuna" class="block text-sm font-medium text-gray-700">Vacuna</label>
        <select
          class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          id="vacuna" required v-model="vacuna">
          <option v-for="vacuna in vacunas" :value="vacuna">
            {{ vacuna.nombre }}
          </option>
        </select>
      </div>

      <div v-if="vacunas_desarrolladas">

        <div class="col-span-6 sm:col-span-3 mb-4">
          <label for="vacuna_desarrollada" class="block text-sm font-medium text-gray-700">Laboratorio que
            desarrolla</label>
          <select
            class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            id="vacuna_desarrollada" required v-model="vacuna_desarrollada">
            <option v-for="vacuna_desarrollada in vacunas_desarrolladas" :value="vacuna_desarrollada">
              {{ vacuna_desarrollada.laboratorio_id.nombre }}
            </option>
          </select>
        </div>

        <div v-if="vacuna_desarrollada">

          <div v-if="envios" class="col-span-6 sm:col-span-3 mb-4">
            <label for="vacuna_desarrollada" class="block text-sm font-medium text-gray-700">Lote de la vacuna a
              aplicar</label>
            <select
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              id="vacuna_desarrollada" required v-model="envio">
              <option v-for="envio in envios" :value="envio">
                Envio del día {{ new Date(envio.created_at).toLocaleDateString() }} del lote n° {{ envio.lote_id.id }}
              </option>
            </select>
          </div>

          <div v-if="envio" class="col-span-6 sm:col-span-3 mb-4">

            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <!-- Heroicon name: outline/exclamation-triangle -->
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Dosis
                  </h3>
                  <div class="mt-2">
                    <!-- <p class="text-sm text-gray-500">
                      Dosis a aplicar: {{ dosis.cantidad + 1 }}°
                    </p>
                    <p class="text-sm text-gray-500">
                      Fecha última dosis: {{ new Date(dosis.ultima.created_at).toLocaleDateString() }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Tipo de vacuna: {{ dosis.ultima.envio_id.lote_id.vacuna_desarrollada_id.vacuna_id.tipo }}
                    </p> -->
                    <p class="text-sm text-gray-500">
                      Edad: {{ getEdad(ciudadano.fecha_hora_nacimiento) }} años
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button href="#" type="submit"
              class="w-full flex justify-center items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Registrar vacunación
            </button>
          </div>
        </div>
      </div>
    </form>

    <div v-if="error" class="col-span-6 sm:col-span-3 mb-4">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <!-- Heroicon name: outline/exclamation-triangle -->
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">¡Atención!
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
