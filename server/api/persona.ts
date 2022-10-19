const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { dni } = getQuery(event);

  if (!dni || !dni.length) return null;

  let error;

  try {
    return await $fetch(`/personas/${dni}/`, {
      baseURL: config.apiRenaperUrl,
      async onResponseError({ response }) {
        // onResponseError is a "ohmyfetch" method
        error = response.status; // assign the error to the declared variable "error"
      },
    });
  } catch (e) {
    if (error === 404)
      throw "No existe una persona con ese número de documento";
    else throw { message: "Error en el servidor RENAPER" };
  }
});
