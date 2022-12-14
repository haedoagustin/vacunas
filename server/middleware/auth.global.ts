import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

const permissions = {
  admin: {
    routes_regexp: new RegExp("^/$|/index*|/usuarios*|/api/*"),
  },
  "operador nacional": {
    routes_regexp: new RegExp(
      "^/$|/index*|/vacuna*|/laboratorio*|/compras*|/distribucion*|/stock*|/api/*"
    ),
  },
  "analista provincial": {
    routes_regexp: new RegExp("^/$|/index*|/vacunacion*|/api/*"),
  },
  vacunador: {
    routes_regexp: new RegExp("^/$|/index*|/vacunacion*|/api/*"),
  },
};

async function canAccessUrl(event, user) {
  event.context.usuario = user;
  const rol = user.rol;

  return permissions[rol].routes_regexp.test(event.req.url);
}

export default defineEventHandler(async (event) => {
  let to = event.req.url;

  if (
    ![
      "/login",
      "/confirm",
      "/api/_supabase/session",
      "/api/login",
      "/api/cant-vacunados",
    ].includes(to)
  ) {
    let user = await serverSupabaseUser(event);
    let client = serverSupabaseServiceRole(event);

    const { data: usuario } = await client
      .from("usuarios")
      .select("*")
      .eq("auth_user_id", user?.id)
      .single();

    if (!usuario) {
      return sendRedirect(event, "/login", 503);
    } else if (!(await canAccessUrl(event, usuario))) {
      return sendRedirect(event, "/", 422);
    }
  }
});
