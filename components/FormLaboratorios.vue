<script setup>
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hfzomrxjxddjafsvhspi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmem9tcnhqeGRkamFmc3Zoc3BpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mzc5OTM5OCwiZXhwIjoxOTc5Mzc1Mzk4fQ.ikpvI6YD26-4oY6M1YmC9dPugawIA3ls6pZJrbF0aV0";
const supabase = createClient(supabaseUrl, supabaseKey);

const nombre = ref("");

const submitLaboratorio = async () => {
  try {
    const { data, error } = await supabase
      .from("laboratorios")
      .insert({ nombre: nombre.value }, { returning: "minimal" });
  } catch (err) {
    console.log("Algo salio mal creando el laboratorio:", err);
  }
};
</script>

<template>
  <div class="w-full max-w-xs">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit="submitLaboratorio"
    >
      <div class="mb-4 shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre del laboratorio
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="nombre"
          id="nombre"
          required
          v-model="nombre"
        />
      </div>
      <input
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        type="submit"
      />
    </form>
  </div>
</template>
