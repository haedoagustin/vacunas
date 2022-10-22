import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  try {
    const { data } = await client.from("vacunaciones").select(`
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
              )
            )
          )
        ),
        created_at,
        dni_vacunado
      `);

    if (!data.length)
      throw "No hay dosis disponibles. La vacuna seleccionada no tiene más dosis disponibles en la jurisdicción en la que usted se encuentra vacunando. Compruebe que haya seleccionado la vacuna y el laboratorio correctos.";

    return data;
  } catch (err) {
    throw "Algo salio mal cargando las vacunaciones";
  }
});
