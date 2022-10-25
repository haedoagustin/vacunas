import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";


const permissions = {
  admin: {
    routes_regexp: new RegExp('^/$|/usuarios*')
  },
  'operador nacional': {
    routes_regexp: new RegExp('^/$|/vacuna*|/laboratorio*|/compras*|/distribucion*')
  },
  'analista provincial':{
    routes_regexp: new RegExp('^/$|(/vacunacion*)')
  },
  vacunador: {
    routes_regexp: new RegExp('^/$/vacunacion*')
  }
}

async function canAccessUrl(event, auth_user_id) {
  const client = serverSupabaseServiceRole(event)

  const { data } = await client.from('usuarios')
    .select('*')
    .eq('auth_user_id', auth_user_id)

  event.context.usuario = data[0]
  const rol = data[0]['rol']

  return permissions[rol].routes_regexp.test(event.req.url)
}

export default defineEventHandler(async (event) => {
  let to = event.req.url;

  if (!["/login", "/confirm", "/api/_supabase/session"].includes(to)) {
    let user = await serverSupabaseUser(event);
    if (!user) {
      await sendRedirect(event, "/login", 503);
    } else if (! await canAccessUrl(event, user.id)){
      await sendRedirect(event, "/", 422);
    }
  }
});
