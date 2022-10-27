import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { compra, updated_data } = await readBody(event);

  const { data, error } = await client
    .from("compras")
    .update(updated_data)
    .eq("id", compra.id)
    .select("*")
    .single();

  if (error) {
    throw `Error actualizando la compra: ${error}`;
  }
  return data;
});
