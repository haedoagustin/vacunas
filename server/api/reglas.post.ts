import brie from "brie";
import reglas from "./reglas.json";
import { monthDiff, getEdad } from "~/helpers/dates";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { vacuna, ciudadano } = await useBody(event);

  ciudadano.embarazada = true

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

    let ultimaDosis =
      count != 0 ? monthDiff(new Date(data[0].created_at), new Date()) : null;

    const datos = {
      proximaDosis,
      edad,  // En meses
      ultimaDosis, // En meses
      personalSalud: ciudadano.personal_salud.toString(),
      embarazada: ciudadano.embarazada.toString(),
    };

    let idRegla = `${vacuna.nombre.replace(" ", "-")}:${proximaDosis}-dosis`;

    brie.setup({
      data: datos,
      features: reglas,
    });

    return {
      ...datos,
      resultado: brie.get(idRegla)
    }
  } catch (e) {
    throw e;
  }
});
