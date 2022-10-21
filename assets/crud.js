export const getDocs = async (client, table, query = null) => {
  if (!query) {
    const { data, error } = await client.from(table).select("*");
    return {
      data,
      error,
    };
  }
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq(query.column, query.value);
  return {
    data,
    error,
  };
};

export const getVacunasDesarrolladas = async (client) => {
  try {
    let { data } = await client.from("vacunas_desarrolladas").select("*");

    data = await Promise.all(
      data.map(async (vacDesarrollada) => {
        vacDesarrollada.laboratorio_id = await getNombreLaboratorio(
          client,
          vacDesarrollada.laboratorio_id
        );
        vacDesarrollada.vacuna_id = await getNombreVacuna(
          client,
          vacDesarrollada.vacuna_id
        );
        return vacDesarrollada;
      })
    );

    return data;
  } catch (err) {
    console.log("Algo salio mal cargando las vacunas: ", err);
  }
};

const getNombreVacuna = async (client, id) => {
  const data = await getDocs(client, "vacunas", { column: "id", value: id });
  return data.data[0].nombre;
};
const getNombreLaboratorio = async (client, id) => {
  const data = await getDocs(client, "laboratorios", {
    column: "id",
    value: id,
  });
  return data.data[0].nombre;
};

export const getVacunaciones = async (client) => {
  try {
    const { data } = await client.from("vacunaciones").select(`
      vacunador (
        apellido,
        nombre
      ),
      envio_id (
        jurisdiccion_id (
          nombre
        ),
        lote_id (
          vacuna_desarrollada_id (
            vacuna_id (
              nombre
            )
          )
        )
      ),
      created_at,
      dni_vacunado
    `);

    return data;
  } catch (err) {
    console.log("Algo salio mal cargando las vacunaciones: ", err);
  }
};

export const getDatosDosis = async (client, id_vacuna, dni_ciudadano) => {
  let { data, count, error } = await client
    .from("vacunaciones")
    .select(
      "created_at, envio_id!inner(lote_id!inner(vacuna_desarrollada_id!inner(vacuna_id)))",
      { count: "exact", head: false }
    )
    .eq("dni_vacunado", dni_ciudadano)
    .eq("envio_id.lote_id.vacuna_desarrollada_id.vacuna_id", id_vacuna)
    .order("created_at", { ascending: false })
    .limit(1);

  return {
    fecha_ultima: data[0]?.created_at,
    proxima: count + 1,
    error,
  };
};

export const getVacunasDesarrolladasByVacunaId = async (client, id_vacuna) => {
  let { data, error } = await client
    .from("vacunas_desarrolladas")
    .select("*, laboratorio_id(*)")
    .eq("vacuna_id", id_vacuna);
  return {
    data,
    error,
  };
};

export const getUsuario = async (client) => {
  const user = useSupabaseUser();
  const { data } = await client
    .from("usuarios")
    .select("*, jurisdiccion(*)")
    .eq("auth_user_id", user.value.id)
    .single();
  return data;
};

export const getEnviosParaVacunacion = async (
  client,
  jurisdiccion_id,
  vacuna_desarrollada_id
) => {
  let { data, error } = await client
    .from("envios")
    .select("*, lote_id!inner(id, vacuna_desarrollada_id!inner(*))")
    .eq("lote_id.vacuna_desarrollada_id.id", vacuna_desarrollada_id)
    .eq("jurisdiccion_id", jurisdiccion_id)
    .gt("cantidad_disponible", 0);

  if (!data.length) {
    error =
      "No hay dosis disponibles. La vacuna seleccionada no tiene más dosis disponibles en la jurisdicción en la que usted se encuentra vacunando. Compruebe que haya seleccionado la vacuna y el laboratorio correctos.";
  }

  return {
    data,
    error,
  };
};

export const postVacunacion = async (client, vacunacion) => {
  try {
    const { data, error } = await client
      .from("vacunaciones")
      .insert(vacunacion)
      .select("*, envio_id(id, cantidad_disponible)")
      .single();

    if (!error) {
      try {
        // Decrementar el stock de vacunas
        await client
          .from("envios")
          .update({
            cantidad_disponible: --data.envio_id.cantidad_disponible,
          })
          .eq("id", data.envio_id.id);
      } catch (err) {
        // Elimina la vacunación recién creada por error al decrementar la
        // cantidad del envio
        await client.from("vacunaciones").delete().eq("id", data.id);
        throw ("Algo salio mal registrando una vacunación:", err);
      }
    }
    return data;
  } catch (err) {
    throw `Algo salio mal registrando una vacunación: ${err}`;
  }
};

export const getEdad = (fecha_nacimiento) => {
  var hoy = new Date();
  // Formatear "26/05/1954 06:18:32" => "1954-05-26T06:18:32Z"
  const [dateValues, timeValues] = fecha_nacimiento.split(" ");
  const [day, month, year] = dateValues.split("/");
  const [hours, minutes, seconds] = timeValues.split(":");
  const cumpleanos = new Date(
    +year,
    +month - 1,
    +day,
    +hours,
    +minutes,
    +seconds
  );
  var edad = hoy.getFullYear() - cumpleanos.getFullYear();
  var m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }

  return edad;
};
