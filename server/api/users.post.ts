import { serverSupabaseServiceRole } from '#supabase/server'
export default eventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  const { user, data, error } = await client.auth.api.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true
  })

  if (error) {
    event.res.statusCode = error.status
    return { message: error.message }
  }
  const usuario = {
    nombre: body.nombre,
    apellido: body.apellido,
    rol: body.rol,
    jurisdiccion: body.jurisdiccion,
    auth_user_id: user.id
  }

  var { data: User, error: ApiError } = await client.from('usuarios')
    .insert(usuario)
    .select('*')

  return { user: data}
})