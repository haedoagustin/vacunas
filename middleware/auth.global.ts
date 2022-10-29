export default defineNuxtRouteMiddleware((to, _from) => {
    if (!["/login", "/confirm"].includes(to.path)) {
      const user = useSupabaseUser();
      if (!user.value) return navigateTo("/login");
    }
  });  