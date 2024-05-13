export default defineNuxtRouteMiddleware((to) => {
  const { data } = useAuth();

  if (!data.value) {
    return navigateTo("/login");
  }

  if (data.value.slug !== to.slug) {
    return navigateTo("/");
  }
});
