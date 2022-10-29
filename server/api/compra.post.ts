import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const { vacuna_desarrollada, precio_total } = await readBody(event);

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
    precio_total,
    estado: "pendiente",
  };

  const { data, error } = await client
    .from("compras")
    .insert(newCompra)
    .select("*")
    .single();

  if (error) {
    throw `Error creando la compra: ${error}`;
  }
  return data;
});
