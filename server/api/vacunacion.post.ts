import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { vacunacion } = await readBody(event);

  try {
    const { data, error } = await client
      .from("vacunaciones")
      .insert(vacunacion)
      .select("*, envio_id(id, cantidad_disponible)")
      .single();

    if (!error) {
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
    }
    return data;
  } catch (err) {
    throw `Algo salio mal registrando una vacunación: ${err}`;
  }
});
