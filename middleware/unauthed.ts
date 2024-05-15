export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, loading } = useAuth();
  console.log("foo", loading.value, loggedIn.value);

  if (!loading.value && loggedIn.value) {
    return navigateTo("/");
  }
});
