import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  let to = event.req.url;
  if (!["/login", "/confirm"].includes(to)) {
    let user = await serverSupabaseUser(event);
    if (!user) {
      sendRedirect(event, "/login", 503);
    }
  }
});
