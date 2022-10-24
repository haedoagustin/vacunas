import { serverSupabaseClient } from "#supabase/server";
import { formatDate, getMonth } from "~/helpers/dates";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { data } = await client.from("vacunas").select("*");

  if (!data.length) throw "No existen vacunas registradas";

  return data.map((vacuna) => {
    let fecha_inicio = formatDate(vacuna.fecha_inicio);
    let fecha_fin = formatDate(vacuna.fecha_fin);
    let [inicio, fin] = (vacuna.intervalo ?? "1-12").split("-");
    if (
      (vacuna.tipo === "Pandemica" &&
        !(new Date() >= fecha_inicio && new Date() <= fecha_fin)) ||
      (vacuna.tipo === "Estacional" &&
        !(
          new Date().getMonth() + 1 >= inicio &&
          new Date().getMonth() + 1 <= fin
        ))
    ) {
      vacuna.inhabilitada = true;
      vacuna.mensaje_error =
        vacuna.tipo == "Pandemica"
          ? `La pandemia no está activa (inicio ${fecha_inicio.toLocaleDateString()}, fin ${fecha_fin.toLocaleDateString()}), no puede aplicar vacunas`
          : `El período de vacunación de la vacuna estacional seleccionada no ha iniciado aún (${getMonth(
              inicio
            )} a ${getMonth(fin)})`;
    }
    return vacuna;
  });
});
