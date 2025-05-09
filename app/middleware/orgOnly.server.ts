export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!user.value) {
    return navigateTo("/login");
  }

  if (user.value.type !== "admin") {
    return navigateTo("/");
  }
});
