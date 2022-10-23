import brie from "brie";
import reglas from "./reglas.json";
import { serverSupabaseClient } from "#supabase/server";

//probamos cosas con brie
const user = {
  edad: 10,
  nroDosis: 1,
  personalSalud: false,
  embarazada: false,
  mesesUltimaDosis: 1,
};

const featureSet = {
  multiPartTestCase: {
    criteria: [
      {
        has: {
          trait: "edad",
          comparison: "above",
          value: 2,
        },
      },
      {
        has: {
          trait: "edad",
          comparison: "above",
          value: 11,
        },
      },
    ],
    criteriaLogic: "and",
  },
};

brie.setup({
  data: user,
  features: featureSet,
});

// const flags = brie.getAll();
// console.log(flags);

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { vacuna: vacunaId, persona, dosis } = await readBody(event);

  const { data: vacuna } = await client
    .from("vacunas")
    .select("*")
    .eq("id", vacunaId);

  const regla = reglas[vacuna[0].nombre][`${dosis}-dosis`];

  if (!regla) return { message: "No hay reglas para esa dosis de esa vacuna" };

  const featureSet = {
    multiPartTestCase: regla,
  };

  console.log(regla);

  brie.setup({
    data: persona,
    features: featureSet,
  });
  const flags = brie.getAll();
  console.log(flags);

  return flags;
});
