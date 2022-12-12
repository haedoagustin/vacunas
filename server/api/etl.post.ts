import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { createClient } from "@supabase/supabase-js";

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const dataWarehouse = createClient(
    process.env.SUPABASE_DATAWAREHOUSE_URL,
    process.env.SUPABASE_DATAWAREHOUSE_KEY
  );

  let { data: vacunaciones } = await client.from("vacunaciones").select(`
          * ,
          envio_id (
            jurisdiccion_id (
              nombre
            ),
            lote_id (
              vacuna_desarrollada_id (
                vacuna_id (
                  nombre
                ),
                laboratorio_id (
                  nombre
                ),
                tipo
              )
            )
          ),
          id_departamento (
              nombre
          ),
          created_at,
          dni_vacunado`);

  // limpiamos el datawarehouse para hacer pruebas
  await dataWarehouse.from("h_vencidas").delete().neq("id", 0);
  await dataWarehouse.from("h_vacunados").delete().neq("id", 0);
  await dataWarehouse.from("d_lugar").delete().neq("id", 0);
  await dataWarehouse.from("d_tiempo").delete().neq("id", 0);
  await dataWarehouse.from("d_vacuna").delete().neq("id", 0);
  await dataWarehouse.from("d_vacunado").delete().neq("id", 0);
  await dataWarehouse.from("h_envios").delete().neq("id", 0);

  // ETL de d_lugar
  const arrDlugar = vacunaciones.map((vacunacion) => {
    return {
      jurisdiccion: vacunacion.envio_id.jurisdiccion_id.nombre,
      departamento: vacunacion.id_departamento.nombre,
    };
  });

  // ETL de d_tiempo
  const arrDtiempo = vacunaciones.map((vacunacion) => {
    return {
      año: vacunacion.created_at.split("-")[0],
      mes: vacunacion.created_at.split("-")[1],
      dia: vacunacion.created_at.split("-")[2].split("T")[0],
    };
  });

  // ETL de d_vacuna
  const arrDvacuna = vacunaciones.map((vacunacion) => {
    return {
      nombre:
        vacunacion.envio_id.lote_id.vacuna_desarrollada_id.vacuna_id.nombre,
      laboratorio:
        vacunacion.envio_id.lote_id.vacuna_desarrollada_id.laboratorio_id
          .nombre,
      tipo_vacuna:
        vacunacion.envio_id.lote_id.vacuna_desarrollada_id.tipo || "arnm",
    };
  });

  // ETL de d_vacunado
  const arrDvacunado = vacunaciones.map((vacunacion) => {
    const edad = Math.floor(
      (new Date().getTime() -
        new Date(vacunacion.fecha_nacimiento_vacunado).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );
    return {
      dni: vacunacion.dni_vacunado,
      anio: edad,
      decenio: Math.floor(edad / 10),
      bicenio: Math.floor(edad / 20),
    };
  });

  // ETL de h_vacunados
  const { data: d_tiempo } = await dataWarehouse
    .from("d_tiempo")
    .insert(arrDtiempo)
    .select();
  const { data: d_lugar } = await dataWarehouse
    .from("d_lugar")
    .insert(arrDlugar)
    .select();
  const { data: d_vacuna } = await dataWarehouse
    .from("d_vacuna")
    .insert(arrDvacuna)
    .select();
  const { data: d_vacunado } = await dataWarehouse
    .from("d_vacunado")
    .insert(arrDvacunado)
    .select();

  const arrHechos = d_tiempo.map((tiempo, i) => {
    return {
      id_tiempo: tiempo.id,
      id_lugar: d_lugar[i].id,
      id_vacuna: d_vacuna[i].id,
      id_vacunado: d_vacunado[i].id,
    };
  });

  await dataWarehouse.from("h_vacunados").insert(arrHechos);

  console.log("-- Terminado el ETL de vacunados --");

  // ETL de h_vencidas
  let { data: vencidas } = await client.from("envios").select(`
          * ,
          jurisdiccion_id (
            nombre
          ),
          lote_id (
            fecha_vencimiento,
            vencido,
            vacuna_desarrollada_id (
                vacuna_id (
                  nombre
                ),
                laboratorio_id (
                  nombre
                ),
                tipo
              )
          )`);

  vencidas = vencidas.filter((vencida) => vencida.lote_id.vencido);

  // ETL de d_lugar
  const arrDlugarVencidas = vencidas.map((vencida) => {
    return {
      jurisdiccion: vencida.jurisdiccion_id.nombre,
      departamento: vencida.jurisdiccion_id.nombre,
    };
  });

  // ETL de d_tiempo
  const arrDtiempoVencidas = vencidas.map((vencida) => {
    return {
      año: vencida.lote_id.fecha_vencimiento.split("-")[0],
      mes: vencida.lote_id.fecha_vencimiento.split("-")[1],
      dia: vencida.lote_id.fecha_vencimiento.split("-")[2],
    };
  });

  // ETL de d_vacuna
  const arrDvacunaVencidas = vencidas.map((vencida) => {
    return {
      nombre: vencida.lote_id.vacuna_desarrollada_id.vacuna_id.nombre,
      laboratorio: vencida.lote_id.vacuna_desarrollada_id.laboratorio_id.nombre,
      tipo_vacuna: vencida.lote_id.vacuna_desarrollada_id.tipo || "arnm",
    };
  });

  const { data: d_tiempo_vencidas } = await dataWarehouse
    .from("d_tiempo")
    .insert(arrDtiempoVencidas)
    .select();
  const { data: d_lugar_vencidas } = await dataWarehouse
    .from("d_lugar")
    .insert(arrDlugarVencidas)
    .select();
  const { data: d_vacuna_vencidas } = await dataWarehouse
    .from("d_vacuna")
    .insert(arrDvacunaVencidas)
    .select();

  const arrHechosVencidas = d_tiempo_vencidas.map((tiempo, i) => {
    return {
      id_tiempo: tiempo.id,
      id_lugar: d_lugar_vencidas[i].id,
      id_vacuna: d_vacuna_vencidas[i].id,
      cantidad: vencidas[i].cantidad_disponible,
    };
  });

  await dataWarehouse.from("h_vencidas").insert(arrHechosVencidas);

  console.log("-- Terminado el ETL de vencidas --");

  // etl de h_envios
  const { data: envios } = await client.from("envios").select(`
          * ,
            jurisdiccion_id (
              nombre
            ),
            lote_id (
              *,
              vacuna_desarrollada_id (
                vacuna_id (
                  *
                ),
                laboratorio_id (
                  *
                )
              )     
            )
   
          `);

  // ETL de d_vacuna
  const arrDvacunaEnvios = envios.map((envio) => {
    return {
      nombre: envio.lote_id.vacuna_desarrollada_id.vacuna_id.nombre,
      laboratorio: envio.lote_id.vacuna_desarrollada_id.laboratorio_id.nombre,
      tipo_vacuna: envio.lote_id.vacuna_desarrollada_id.tipo || "arnm",
    };
  });

  // ETL de d_tiempo
  const arrDtiempoEnvios = envios.map((envio) => {
    return {
      año: envio.created_at.split("-")[0],
      mes: envio.created_at.split("-")[1],
      dia: envio.created_at.split("T")[0].split("-")[2],
    };
  });

  const { data: d_tiempo_envios, error } = await dataWarehouse
    .from("d_tiempo")
    .insert(arrDtiempoEnvios)
    .select();
  const { data: d_vacuna_envios } = await dataWarehouse
    .from("d_vacuna")
    .insert(arrDvacunaEnvios)
    .select();

  // console.log(error, d_tiempo_envios);
  // ETL de h_envios
  const arrHechosEnvios = d_tiempo_envios.map((tiempo, i) => {
    return {
      id_tiempo: tiempo.id,
      id_vacuna: d_vacuna_envios[i].id,
      jurisdiccion: envios[i].jurisdiccion_id.nombre,
      cantidad_vencidas: envios[i].lote_id.vencido
        ? envios[i].cantidad_disponible
        : 0,
      cantidad_enviadas: envios[i].cantidad,
      cantidad_usadas: envios[i].cantidad - envios[i].cantidad_disponible,
    };
  });
  console.log(arrHechosEnvios);
  await dataWarehouse.from("h_envios").insert(arrHechosEnvios);

  return {
    status: "ok",
  };
});
