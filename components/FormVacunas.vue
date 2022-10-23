<script setup>
const client = useSupabaseClient();

const emit = defineEmits(["submit-vacuna"]);

const vacuna = {
  nombre: ref(""),
  tipo: ref(""),
  inicioIntervalo: ref(null),
  finIntervalo: ref(null),
  fechaInicio: ref(null),
  fechaFin: ref(null),
};
let loading = ref(false);

const meses = [...Array(12).keys()].map((key) => ({
  nro: ++key,
  nombre: new Date(0, --key).toLocaleString("es", { month: "long" }),
}));

let tipos_vacuna = ["Calendario", "Estacional", "Pandemica"];

const intervaloValido = (intervalo) => intervalo < 13 && intervalo > 0;

const submitVacuna = async () => {
  if (loading.value) return;
  loading.value = true;
  const row = {};

  if (
    vacuna.tipo.value === "Estacional" &&
    vacuna.inicioIntervalo.value &&
    vacuna.finIntervalo.value &&
    intervaloValido(vacuna.inicioIntervalo.value) &&
    intervaloValido(vacuna.finIntervalo.value)
  )
    row.intervalo = `${vacuna.inicioIntervalo.value}-${vacuna.finIntervalo.value}`;
  else row.intervalo = null;

  if (vacuna.tipo.value === "Pandemica") {
    row.fecha_inicio = vacuna.fechaInicio.value
      ? new Date(vacuna.fechaInicio.value)
      : null;
    row.fecha_fin = vacuna.fechaFin.value
      ? new Date(vacuna.fechaFin.value)
      : null;
  } else {
    row.fecha_inicio = null;
    row.fecha_fin = null;
  }

  row.nombre = vacuna.nombre.value;
  row.tipo = vacuna.tipo.value;

  try {
    const { data, error } = await client
      .from("vacunas")
      .insert(row, { returning: "minimal" });

    // si la vacuna se creo correctamente cerramos el formulario
    emit("submit-vacuna");
    loading.value = false;
  } catch (err) {
    console.log("Algo salio mal creando una vacuna:", err);
  }
};
</script>

<template>
  <div class="w-full">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
      @submit="submitVacuna"
    >
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre de la vacuna
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Nombre"
          id="nombre"
          required
          v-model="vacuna.nombre.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
          Tipo de la vacuna
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="tipo"
          placeholder="Tipo"
          required
          v-model="vacuna.tipo.value"
        >
          <option v-for="tipo_vacuna in tipos_vacuna">{{ tipo_vacuna }}</option>
        </select>
      </div>
      <div class="mb-4 shadow-md" v-if="vacuna.tipo.value == 'Estacional'">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="inicio-intervalo"
        >
          Mes de inicio de intervalo de vacunación estacional
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="inicio-intervalo"
          placeholder="inicio de intervalo"
          required
          v-model="vacuna.inicioIntervalo.value"
        >
          <option v-for="mes in meses" :value="mes.nro">
            {{ mes.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-4 shadow-md" v-if="vacuna.tipo.value == 'Estacional'">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fin-intervalo"
        >
          Mes de fin de intervalo de vacunación estacional
        </label>
        <select
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="fin-intervalo"
          placeholder="Fin de intervalo"
          required
          v-model="vacuna.finIntervalo.value"
        >
          <option v-for="mes in meses" :value="mes.nro">
            {{ mes.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-4 shadow-md" v-if="vacuna.tipo.value === 'Pandemica'">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fecha-inicio"
        >
          Fecha de inicio de pandemia
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="date"
          id="fecha-inicio"
          placeholder="fecha de inicio"
          v-model="vacuna.fechaInicio.value"
        />
      </div>
      <div class="mb-4 shadow-md" v-if="vacuna.tipo.value === 'Pandemica'">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fecha-fin"
        >
          Fecha de fin de pandemia
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="date"
          id="fecha-fin"
          placeholder="fecha de fin"
          v-model="vacuna.fechaFin.value"
        />
      </div>
      <button
        href="#"
        class="w-full flex justify-center inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="realizarCompra"
      >
        <LoadingSpin
          v-if="loading"
          class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
          aria-hidden="true"
        />
        <span v-if="!loading"> Crear vacuna </span>
      </button>
    </form>
  </div>
</template>
