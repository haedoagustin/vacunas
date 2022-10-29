import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { compra, vacuna_desarrollada, cantidad } = await readBody(event);

  const dateVencimiento = new Date();
  dateVencimiento.setDate(
    dateVencimiento.getDate() + vacuna_desarrollada.vida_util
  );

  // Crear lote
  const newLote = {
    fecha_vencimiento: dateVencimiento,
    vacuna_desarrollada_id: vacuna_desarrollada.id,
    cantidad: cantidad,
    // Cuando la compra pasa al estado "entregada" se actualiza la cantidad disponible
    cantidad_disponibles: 0,
    compra_id: compra.id,
  };

  const { data: lote, error: errorLote } = await client
    .from("lotes")
    .insert(newLote)
    .select("*")
    .single();

  if (errorLote) {
    throw errorLote;
  }
  return lote;
});
