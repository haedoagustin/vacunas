import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { vacunacion, jurisdiccion_id } = await readBody(event);

  let { data: departamentos, error: errorDep } = await client
    .from("departamentos")
    .select("id")
    .eq("jurisdiccion_id", jurisdiccion_id);

  if (errorDep)
    throw `No se pudieron obtener datos de departamentos en la jurisdicción del vacunador: ${errorDep}`;

  var departamento =
    departamentos[Math.floor(Math.random() * departamentos.length)];

  vacunacion.id_departamento = departamento.id;

  const { data, error } = await client
    .from("vacunaciones")
    .insert(vacunacion)
    .single();

  if (error) throw `Algo salio mal registrando una vacunación: ${error.message}`;
  
  return data;
});
