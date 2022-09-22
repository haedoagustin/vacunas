export default defineNuxtRouteMiddleware((to, _from) => {
  try {
    const user = useSupabaseUser();
    if (!user.value) return navigateTo("/login");
  } catch {
    return navigateTo("/login");
  }
});
