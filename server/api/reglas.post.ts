import brie from "brie";
import { monthDiff, getEdad } from "~/helpers/dates";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { vacuna, ciudadano } = await useBody(event);

  try {
    let { data, count } = await client
      .from("vacunaciones")
      .select(
        "created_at, envio_id!inner(lote_id!inner(vacuna_desarrollada_id!inner(vacuna_id)))",
        { count: "exact", head: false }
      )
      .eq("dni_vacunado", ciudadano.DNI)
      .eq("envio_id.lote_id.vacuna_desarrollada_id.vacuna_id", vacuna.id)
      .order("created_at", { ascending: false })
      .limit(1);

    let proximaDosis = count + 1;

    let edad = getEdad(ciudadano.fecha_hora_nacimiento);

    let { data: reglas_db } = await client
      .from("reglas")
      .select("condicion")
      .eq("vacuna_id", vacuna.id)
      .eq("dosis", proximaDosis)
      .single();

    if (!reglas_db) {
      throw "Error: no hay reglas cargadas para la vacuna o dosis.";
    }

    let ultimaDosis =
      count != 0 ? monthDiff(new Date(data[0].created_at), new Date()) : null;

    const datos = {
      proximaDosis,
      edad, // En meses
      ultimaDosis, // En meses
      personalSalud: ciudadano.personal_salud.toString(),
      embarazada: ciudadano.embarazada.toString(),
    };

    brie.setup({
      data: datos,
      features: reglas_db.condicion,
    });

    const evaluacion = brie.getAll();

    return {
      ...datos,
      resultado: Object.values(evaluacion).every((result) => result as boolean),
      no_pasaron: Object.keys(evaluacion).filter(
        (regla) => !(evaluacion[regla] as boolean)
      ),
    };
  } catch (e) {
    throw e;
  }
});
