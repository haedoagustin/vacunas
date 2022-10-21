export default async function () {
  try {
    const client = useSupabaseClient();
    const user = useSupabaseUser();

    if (user.value)
      return await client
        .from("usuarios")
        .select("*, jurisdiccion(*)")
        .eq("auth_user_id", user.value?.id)
        .single();
  } catch (e) {
    return e;
  }
}
