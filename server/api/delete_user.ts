import { serverSupabaseServiceRole } from '#supabase/server'
export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)
    const query = await getQuery(event)

    const user_id = query.user_id
    console.log('recibiendo el id' + user_id)

    var { data, error } = await client.from('usuarios')
        .select('auth_user_id')
        .eq('id', user_id)

    var { data:user, error:PostgresError } = await client.auth.api.deleteUser(data[0].auth_user_id)

    if (error) {
        event.res.statusCode = parseInt(error.code)
        return { message: error.message }
    }

    var resp = await client
        .from('usuarios')
        .delete()
        .match({ id: user_id })

    return{data: data}
})