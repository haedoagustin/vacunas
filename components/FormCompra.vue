<script setup>
import { toCurrency } from "~/helpers/numbers";
const emit = defineEmits(["inicio-completado"]);

onMounted(() => {
  refreshNuxtData('vacunas')
});

const { data: vacunas } = await useAsyncData('vacunas', () => $fetch('/api/vacuna'))
const vacuna = ref()
const vacuna_desarrollada = ref()
const vacunas_desarrolladas = ref([])
const error = ref()

const cantidad = ref(0);
const loading = ref(false)
const precio_total = computed(() => cantidad.value * vacuna_desarrollada.value.precio)

watch(vacuna, async () => {
  error.value = null;
  vacunas_desarrolladas.value = []
  vacuna_desarrollada.value = null;
  if (vacuna.value) {
    if (vacuna.value.inhabilitada && vacuna.value.tipo == 'Pandemica') {
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

const realizarCompra = async (e) => {
  if (loading.value) return;
  loading.value = true;
  try {
    let compra = await $fetch("/api/compra", { method: 'post', body: { vacuna_desarrollada: vacuna_desarrollada.value, precio_total: precio_total.value } });
    let lote = await $fetch("/api/lote", { method: 'post', body: { compra, vacuna_desarrollada: vacuna_desarrollada.value, cantidad: cantidad.value } });
    if (lote) emit("inicio-completado")
  } catch (e) {
    error.value = e
  }
  loading.value = false;
};
</script>

<template>

  <div>
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Compra de vacunas</h3>
          <p class="mt-1 text-sm text-gray-600">Aquí se inicia el proceso de compra de vacunas desarrolladas por
            laboratorio.</p>
        </div>
      </div>

      <div class="mt-5 md:col-span-2 md:mt-0">
        <div class="shadow sm:overflow-hidden sm:rounded-md">
          <div class="space-y-6 bg-white px-4 py-5 sm:p-6">

            <div class="grid grid-cols-3 gap-6">
              <div class="col-span-3 sm:col-span-2">
                <label for="vacuna" class="block text-sm font-medium text-gray-700">Vacuna</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <select
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    id="vacuna" required v-model="vacuna">
                    <option v-for="vacuna in vacunas" :value="vacuna">
                      {{ vacuna.nombre }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div v-if="vacunas_desarrolladas.length" class="grid grid-cols-3 gap-6">
              <div class="col-span-3 sm:col-span-2">
                <label for="vacuna_desarrollada" class="block text-sm font-medium text-gray-700">Laboratorio</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <select
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    id="vacuna_desarrollada" required v-model="vacuna_desarrollada">
                    <option v-for="vacuna_desarrollada in vacunas_desarrolladas" :value="vacuna_desarrollada">
                      {{ vacuna_desarrollada.laboratorio_id.nombre }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200"></div>
      </div>
    </div>

    <div v-if="vacuna_desarrollada" class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Información del desarrollo</h3>
            <p class="mt-1 text-sm text-gray-600">Datos de la vacuna desarrollada, fechas de entrega y precio.</p>
          </div>
        </div>

        <div class="mt-5 md:col-span-2 md:mt-0">
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-white px-4 py-5 sm:p-6">

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Desarrollador</label>
                  <input readonly disabled :value="vacuna_desarrollada.laboratorio_id.nombre" type="text"
                    name="first-name" id="first-name" autocomplete="given-name"
                    class="mt-1 block w-full appearance-none rounded-md rounded-t-md border shadow-sm border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Precio unitario</label>
                  <input readonly disabled :value="toCurrency(vacuna_desarrollada.precio)" type="text" name="first-name"
                    id="first-name" autocomplete="given-name"
                    class="mt-1 block w-full appearance-none rounded-md rounded-t-md border shadow-sm border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Tiempo de entrega</label>
                  <input readonly disabled :value="`${vacuna_desarrollada.tiempo_entrega} días`" type=" text"
                    name="first-name" id="first-name" autocomplete="given-name"
                    class="mt-1 block w-full appearance-none rounded-md rounded-t-md border shadow-sm border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="vacuna_desarrollada" class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Datos para la compra</h3>
            <p class="mt-1 text-sm text-gray-600">Formulario para completar la compra del lote de vacunas.</p>
          </div>
        </div>

        <div class="mt-5 md:col-span-2 md:mt-0">
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-white px-4 py-5 sm:p-6">

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="cantidad" class="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input v-model="cantidad" type="number" name="cantidad" id="cantidad" autocomplete="cantidad"
                    class="mt-1 block w-full appearance-none rounded-md rounded-t-md border shadow-sm border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Precio total</label>
                  <input readonly disabled :value="toCurrency(precio_total)" type="text" name="first-name"
                    id="first-name" autocomplete="given-name"
                    class="mt-1 block w-full appearance-none rounded-md rounded-t-md border shadow-sm border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">

                  <button @click="realizarCompra"
                    class="mt-1 group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LoadingSpin v-if="loading" class="animate-spin h-5 w-5 text-blue-500 group-hover:text-blue-400"
                        aria-hidden="true" />
                    </span>

                    <span>
                      Realizar la compra
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ErrorAlert v-if="error" :error="error" />

</template>
