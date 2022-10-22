import { serverSupabaseClient } from "#supabase/server";
import { formatDate } from "~/helpers/dates";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { data } = await client.from("vacunas").select("*");

  if (!data.length) throw "No existen vacunas registradas";

  return data.map((vacuna) => {
    let fecha_inicio = vacuna.fecha_inicio ?? formatDate(vacuna.fecha_inicio);
    let fecha_fin = vacuna.fecha_fin ?? formatDate(vacuna.fecha_fin);
    if (
      vacuna.tipo === "Pandemica" &&
      !(fecha_inicio >= new Date() <= fecha_fin)
    )
      vacuna.inhabilitada = true;
    return vacuna;
  });
});
