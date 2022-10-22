import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { jurisdiccion_id, vacuna_desarrollada_id } = useQuery(event);

  let { data } = await client
    .from("envios")
    .select("*, lote_id!inner(id, vacuna_desarrollada_id!inner(*))")
    .eq("lote_id.vacuna_desarrollada_id.id", vacuna_desarrollada_id)
    .eq("lote_id.vencido", false)
    .eq("jurisdiccion_id", jurisdiccion_id)
    .gt("cantidad_disponible", 0);

  if (!data.length)
    throw "No hay dosis disponibles. La vacuna seleccionada no tiene más dosis disponibles en la jurisdicción en la que usted se encuentra vacunando. Compruebe que haya seleccionado la vacuna y el laboratorio correctos.";

  return data;
});
