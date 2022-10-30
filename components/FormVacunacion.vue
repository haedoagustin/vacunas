<script setup>
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
const resultado_reglas = ref()

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
    if (vacuna.value.inhabilitada) {
      error.value = vacuna.value.mensaje_error;
    } else {
      error.value = null
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
  resultado_reglas.value = null
  if (envio.value && vacuna.value.tipo === 'Calendario') {
    try {
      let data = await $fetch('/api/reglas', { method: 'post', body: { vacuna: vacuna.value, ciudadano: ciudadano.value } })
      resultado_reglas.value = data
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
    alert('Vacunación registrada con éxito')
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

              <div v-if="resultado_reglas" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                <div class="overflow-hidden bg-white shadow sm:rounded-lg">

                  <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Condiciones de aplicación</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Información a tener en cuenta para la aplicación de
                      la vacuna.
                    </p>
                  </div>
                  <div class="border-t border-gray-200">
                    <dl>
                      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Dosis a aplicar</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ resultado_reglas.proximaDosis
                        }}°</dd>
                      </div>
                      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Fecha última dosis</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {{ resultado_reglas.ultimaDosis > 12 ?
                              `${resultado_reglas.ultimaDosis / 12} años` :
                              `${resultado_reglas.ultimaDosis ?? 0} meses`
                          }}</dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">¿Es personal de salud?</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {{ JSON.parse(resultado_reglas.personalSalud) ? 'Si' : 'No' }}
                        </dd>
                      </div>
                      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">¿Es embarazada?</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {{ JSON.parse(resultado_reglas.embarazada) ? 'Si' : 'No' }}
                        </dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Edad</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {{ resultado_reglas.edad > 12 ? `${Math.round(resultado_reglas.edad / 12)} años` :
                              `${resultado_reglas.edad} meses`
                          }}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div v-if="resultado_reglas.resultado" class="bg-emerald-200 px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Resultado</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">El ciudadano cumple con las reglas para la
                      aplicación de la vacuna seleccionada.
                    </p>
                  </div>

                  <div v-else class="bg-red-100 px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Resultado</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Las siguientes reglas no pasan las condiciones para
                      la aplicación de la vacuna seleccionada.
                    </p>

                    <div v-if="!resultado_reglas.resultado && resultado_reglas.no_pasaron.length"
                      class="border-t border-gray-200">
                      <dl>
                        <div v-for="regla in resultado_reglas.no_pasaron" :key="regla"
                          class="bg-red-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {{ regla }}
                          </dd>
                        </div>
                      </dl>
                    </div>

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

    <ErrorAlert v-if="error" :error="error" />

  </div>
</template>
