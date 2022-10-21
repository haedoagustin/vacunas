import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  let to = event.req.url;
  if (!["/login", "/confirm", "/api/_supabase/session"].includes(to)) {
    let user = await serverSupabaseUser(event);
    if (!user) {
      await sendRedirect(event, "/login", 503);
    }
  }
});
