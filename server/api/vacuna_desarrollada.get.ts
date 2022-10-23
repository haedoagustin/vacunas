import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { vacuna_id } = useQuery(event);

  let { data } = await client
    .from("vacunas_desarrolladas")
    .select("*, laboratorio_id(*)")
    .eq("vacuna_id", vacuna_id);

  if (!data.length) throw "No existen desarrollos de esta vacuna";
  return data;
});
