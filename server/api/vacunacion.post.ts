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
    .select("*, envio_id(id, cantidad_disponible)")
    .single();

  if (error) throw `Algo salio mal registrando una vacunación: ${error.message}`;

  try {
    // Decrementar el stock de vacunas
    await client
      .from("envios")
      .update({
        cantidad_disponible: --data.envio_id.cantidad_disponible,
      })
      .eq("id", data.envio_id.id);
  } catch (err) {
    // Elimina la vacunación recién creada por error al decrementar la
    // cantidad del envio
    await client.from("vacunaciones").delete().eq("id", data.id);

    throw err;
  }
  return data;
});
