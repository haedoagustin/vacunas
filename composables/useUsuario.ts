import { getUsuario } from "../assets/crud";

export default async function () {
  const client = useSupabaseClient();
  return await getUsuario(client);
}
