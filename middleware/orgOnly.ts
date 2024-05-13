export default defineNuxtRouteMiddleware(() => {
  const { data } = useAuth();

  if (!data.value) {
    return navigateTo("/login");
  }

  if (data.value.type !== "org") {
    return navigateTo("/");
  }
});
