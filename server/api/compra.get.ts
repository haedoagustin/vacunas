import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { estado } = useQuery(event);

  let columns =
    "*, lotes(id, cantidad, vacuna_desarrollada_id(laboratorio_id(*), vacuna_id(*)))";

  const { data: compras } = estado
    ? await client.from("compras").select(columns).eq("estado", estado)
    : await client.from("compras").select(columns);

  return compras;
});
