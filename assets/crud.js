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
