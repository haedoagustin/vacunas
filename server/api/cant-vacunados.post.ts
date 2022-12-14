import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const { jurisdiccion, mes, vacuna, laboratorio } = await readBody(event);
  if (
    !(
      process.env.SUPABASE_KEY ==
      event.req.headers.authorization?.replace("Bearer ", "")
    )
  )
    return "Las crendenciales no son correctas";

  if (!jurisdiccion || !mes || !vacuna || !laboratorio)
    return "No se ingresaron todos los datos";

  let { data: vac } = await client
    .from("vacunas")
    .select("*")
    .eq("nombre", vacuna);
  let { data: jur } = await client
    .from("jurisdicciones")
    .select("*")
    .eq("nombre", jurisdiccion);
  let { data: lab } = await client
    .from("laboratorios")
    .select("*")
    .eq("nombre", laboratorio);

  if (jur.length == 0 || vac.length == 0 || lab.length == 0)
    return "alguno de los datos ingresados es incorrecto";

  jur = jur[0];
  vac = vac[0];
  lab = lab[0];

  const { data: vacDe } = await client
    .from("vacunas_desarrolladas")
    .select("*")
    .eq("vacuna_id", vac.id)
    .eq("laboratorio_id", lab.id);

  if (vacDe.length == 0)
    return "esa vacuna no es desarrollada por ese laboratorio";

  const { data: vacunaciones } = await client.from("vacunaciones").select(`
  *, 
  envio_id (
    lote_id (
      vacuna_desarrollada_id
    ),
    jurisdiccion_id(
      nombre
    )
  )
  `);

  return {
    jurisdiccion,
    vacuna,
    laboratorio,
    mes,
    vacunaciones: vacunaciones.filter((vacunacion) => {
      return (
        vacunacion.envio_id.jurisdiccion_id.nombre == jurisdiccion &&
        vacunacion.envio_id.lote_id.vacuna_desarrollada_id == vacDe[0].id &&
        vacunacion.created_at.split("-")[1] == mes
      );
    }).length,
  };
});
