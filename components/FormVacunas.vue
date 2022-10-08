<script setup>
const client = useSupabaseClient()

const vacuna = {
  nombre: ref(""),
  tipo: ref(""),
  inicioIntervalo: ref(null),
  finIntervalo: ref(null),
  fechaInicio: ref(null),
  fechaFin: ref(null),
};

const intervaloValido = (intervalo) => intervalo < 13 && intervalo > 0;

const submitVacuna = async () => {
  const row = {};

  if (
    vacuna.inicioIntervalo.value &&
    vacuna.finIntervalo.value &&
    intervaloValido(vacuna.inicioIntervalo.value) &&
    intervaloValido(vacuna.finIntervalo.value)
  )
    row.intervalo = `${vacuna.inicioIntervalo.value}-${vacuna.finIntervalo.value}`;

  if (vacuna.fechaInicio.value && vacuna.fechaFin.value) {
    row.fecha_inicio = new Date(vacuna.fechaInicio.value);
    row.fecha_fin = new Date(vacuna.fechaFin.value);
  }

  row.nombre = vacuna.nombre.value;
  row.tipo = vacuna.tipo.value;

  console.log(row);
  try {
    const { data, error } = await client
      .from("vacunas")
      .insert(row, { returning: "minimal" });
  } catch (err) {
    console.log("Algo salio mal creando una vacuna:", err);
  }
};
</script>

<template>
  <div class="w-full max-w-xs">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit="submitVacuna"
    >
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre de la vacuna
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="nombre"
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
          type="text"
          id="tipo"
          placeholder="tipo"
          required
          v-model="vacuna.tipo.value"
        >
          <option>Estacional</option>
          <option>Pandemica</option>
        </select>
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="inicio-intervalo"
        >
          Inicio de intervalo
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="inicio-intervalo"
          placeholder="inicio de intervalo"
          v-model="vacuna.inicioIntervalo.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fin-intervalo"
        >
          Fin de intervalo
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="fin-intervalo"
          placeholder="fin de intervalo"
          v-model="vacuna.finIntervalo.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fecha-inicio"
        >
          Fecha de inicio
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="date"
          id="fecha-inicio"
          placeholder="fecha de inicio"
          v-model="vacuna.fechaInicio.value"
        />
      </div>
      <div class="mb-4 shadow-md">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="fecha-fin"
        >
          Fecha de fin
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="date"
          id="fecha-fin"
          placeholder="fecha de fin"
          v-model="vacuna.fechaFin.value"
        />
      </div>
      <input
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        type="submit"
      />
    </form>
  </div>
</template>
