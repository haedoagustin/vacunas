import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  try {
    const { data, error } = await client.from("vacunaciones").select(`
        vacunador (
          apellido,
          nombre
        ),
        envio_id (
          jurisdiccion_id (
            nombre
          ),
          lote_id (
            vacuna_desarrollada_id (
              vacuna_id (
                nombre
              ),
              laboratorio_id (
                nombre
              )
            )
          )
        ),
        created_at,
        dni_vacunado
      `);

    return data;
  } catch (err) {
    throw "Algo salio mal cargando las vacunaciones";
  }
});
