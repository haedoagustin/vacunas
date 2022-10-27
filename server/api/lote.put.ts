import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { lote, updated_data } = await readBody(event);

  const { data, error } = await client
    .from("lotes")
    .update(updated_data)
    .eq("id", lote.id)
    .select("*")
    .single();

  if (error) {
    throw `Error actualizando el lote: ${error}`;
  }
  return data;
});
