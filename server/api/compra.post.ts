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

  const dateEntrega = new Date();
  dateEntrega.setDate(
    dateEntrega.getDate() + vacuna_desarrollada.tiempo_entrega
  );

  const compra = {
    usuario_id: usuario?.id,
    fecha_entrega: dateEntrega,
    estado: "pendiente",
  };

  const dateVencimiento = new Date();
  dateVencimiento.setDate(
    dateVencimiento.getDate() + vacuna_desarrollada.vida_util
  );

  const lote = {
    fecha_vencimiento: dateVencimiento,
    vacuna_desarrollada_id: vacuna_desarrollada.id,
    cantidad: cantidad,
    cantidad_disponibles: cantidad,
  };

  // Crear los objetos compra y lote
  const { data, error } = await client
    .from("compras")
    .insert(compra)
    .select("*")
    .single();

  if (!error) {
    try {
      await client.from("lotes").insert(lote);
    } catch (err) {
      // Elimina la compra recién creada por error al crear el lote
      await client.from("compras").delete().eq("id", data.id);

      throw err;
    }
  } else throw error;
  return data;
});
