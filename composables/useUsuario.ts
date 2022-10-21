export default async function () {
  try {
    const client = useSupabaseClient();
    const user = useSupabaseUser();

    if (user.value) {
      const { data } = await client
        .from("usuarios")
        .select("*, jurisdiccion(*)")
        .eq("auth_user_id", user.value?.id)
        .single();
      return data;
    }
  } catch (e) {
    return e;
  }
}
