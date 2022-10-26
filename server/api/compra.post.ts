import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const { vacuna_desarrollada, cantidad } = await readBody(event);

  const { data: usuario } = await client
    .from("usuarios")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  // Crear compra
  const dateEntrega = new Date();
  dateEntrega.setDate(
    dateEntrega.getDate() + vacuna_desarrollada.tiempo_entrega
  );

  const newCompra = {
    usuario_id: usuario?.id,
    fecha_entrega: dateEntrega,
    estado: "pendiente",
  };

  const { data: compra, error: errorCompra } = await client
    .from("compras")
    .insert(newCompra)
    .select("*")
    .single();

  if (errorCompra) {
    if (compra) await client.from("compras").delete().eq("id", compra.id);
    throw errorCompra;
  } else {
    const dateVencimiento = new Date();
    dateVencimiento.setDate(
      dateVencimiento.getDate() + vacuna_desarrollada.vida_util
    );

    // Crear lote
    const newLote = {
      fecha_vencimiento: dateVencimiento,
      vacuna_desarrollada_id: vacuna_desarrollada.id,
      cantidad: cantidad,
      cantidad_disponibles: cantidad,
      compra_id: compra.id,
    };

    const { data: lote, error: errorLote } = await client
      .from("lotes")
      .insert(newLote)
      .select("*")
      .single();

    if (errorLote) {
      if (lote) await client.from("lotes").delete().eq("id", lote.id);
      throw errorLote;
    }
  }

  return compra;
});
