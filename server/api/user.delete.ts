import { serverSupabaseServiceRole } from "#supabase/server";
export default eventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  const query = await getQuery(event);

  const user_id = query.user_id;
  console.log("recibiendo el id" + user_id);

  var { data, error } = await client
    .from("usuarios")
    .select("auth_user_id")
    .eq("id", user_id);

  if (error) throw error.message;

  const { error: errorForeign } = await client
    .from("usuarios")
    .delete()
    .match({ id: user_id });

  if (errorForeign)
    throw "No se puede eliminar al usuario ya que este realizo varias acciones en el sistema que no pueden eliminarse";

  var { data: user, error: errorAuth } = await client.auth.api.deleteUser(
    data[0].auth_user_id
  );

  if (errorAuth)
    throw "No se puede eliminar al usuario ya que este realizo varias acciones en el sistema que no pueden eliminarse";

  return { data: data };
});
