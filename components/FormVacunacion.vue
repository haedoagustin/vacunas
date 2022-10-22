<script setup>
import { getEdad } from "~/helpers/dates";

const emit = defineEmits(['submit-vacunacion'])

const usuario = await useUsuario()

const loading = ref(false)
const error = ref()

const ciudadano = ref();
const vacunas = ref([]);
const vacuna = ref()
const vacunas_desarrolladas = ref([]);
const vacuna_desarrollada = ref()
const envios = ref([]);
const envio = ref();
const dosis = reactive({ fecha_ultima: null, proxima: null })

watch(ciudadano, async () => {
  vacunas.value = []
  vacuna.value = null
  if (ciudadano.value) {
    try {
      let data = await $fetch('/api/vacuna')
      vacunas.value = data
    } catch ({ data: err }) {
      error.value = err.message
    }
  }
})

watch(vacuna, async () => {
  error.value = null;
  vacunas_desarrolladas.value = []
  vacuna_desarrollada.value = null;
  if (vacuna.value) {
    if (vacuna.inhabilitada) {
      error.value = "La pandemia no está activa, no puede aplicar vacunas.";
    } else {
      try {
        let data = await $fetch('/api/vacuna_desarrollada', { query: { vacuna_id: vacuna.value.id } })
        vacunas_desarrolladas.value = data
      } catch ({ data: err }) {
        error.value = err.message
      }
    }
  }
})

watch(vacuna_desarrollada, async () => {
  error.value = null;
  envios.value = [];
  envio.value = null;
  if (vacuna_desarrollada.value) {
    try {
      let data = await $fetch('/api/envios', { query: { jurisdiccion_id: usuario.jurisdiccion.id, vacuna_desarrollada_id: vacuna_desarrollada.value.id } })
      envios.value = data
    } catch ({ data: err }) {
      error.value = err.message
    }
  }
})

watch(envio, async () => {
  error.value = null;
  dosis.value = { fecha_ultima: null, proxima: null };
  if (envio.value) {
    try {
      let { fecha_ultima, proxima } = await $fetch('/api/dosis', { query: { vacuna_desarrollada_id: vacuna_desarrollada.value.id, ciudadano_dni: ciudadano.value.DNI } })
      dosis.fecha_ultima = fecha_ultima
      dosis.proxima = proxima
    } catch ({ data: err }) {
      error.value = err.message
    }
  }
})

const registrarVacunacion = async () => {
  error.value = null;
  let vacunacion = {
    vacunador: usuario.id,
    dni_vacunado: ciudadano.value?.DNI,
    envio_id: envio.value?.id
  }
  try {
    let { data } = await $fetch('/api/vacunacion', { method: 'post', body: { vacunacion } })
    emit("submit-vacunacion", data);
  } catch (e) {
    error.value = e
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

    <form v-if="ciudadano" @submit.prevent="registrarVacunacion">

      <div v-if="vacunas.length" class="col-span-6 sm:col-span-3 mb-4">
        <label for="vacuna" class="block text-sm font-medium text-gray-700">Vacuna</label>
        <select
          class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          id="vacuna" required v-model="vacuna">
          <option v-for="vacuna in vacunas" :value="vacuna">
            {{ vacuna.nombre }}
          </option>
        </select>

        <div v-if="vacunas_desarrolladas.length">

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

          <div v-if="envios.length">

            <div class="col-span-6 sm:col-span-3 mb-4">
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
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>

                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Información sobre la vacuna
                      a
                      aplicar
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Dosis a aplicar: {{ dosis.proxima }}°
                      </p>
                      <p v-if="dosis.fecha_ultima" class="text-sm text-gray-500">
                        Fecha última dosis: {{ new Date(dosis.fecha_ultima).toLocaleDateString() }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Tipo de vacuna: {{ vacuna.tipo }}
                      </p>
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
      </div>

    </form>

    <ErrorAlert v-if="error" :error="error" />

  </div>
</template>
