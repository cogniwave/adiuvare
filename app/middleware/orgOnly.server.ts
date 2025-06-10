export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!user.value) {
    return navigateTo("/login");
  }

  // if (user.value.type !== "org") {
  //   return navigateTo("/");
  // }
});
