import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { vacuna_desarrollada_id, ciudadano_dni } = useQuery(event);

  let { data, count } = await client
    .from("vacunaciones")
    .select(
      "created_at, envio_id!inner(lote_id!inner(vacuna_desarrollada_id!inner(vacuna_id)))",
      { count: "exact", head: false }
    )
    .eq("dni_vacunado", ciudadano_dni)
    .eq(
      "envio_id.lote_id.vacuna_desarrollada_id.vacuna_id",
      vacuna_desarrollada_id
    )
    .order("created_at", { ascending: false })
    .limit(1);

  return {
    fecha_ultima: data[0]?.created_at,
    proxima: count + 1,
  };
});
