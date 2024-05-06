type MiddlewareMeta = null | {
  /** Whether to only allow authenticated users to access this page.
   * Unauthenticated users will be redirected to navigateUnauthenticatedTo or `/login`
   *
   * @default undefined
   */
  authenticatedOnly?: boolean;

  /** Whether to only allow unauthenticated users to access this page.
   * Authenticated users will be redirected to navigateAuthenticatedTo or `/`
   *
   * @default undefined
   */
  unauthenticatedOnly?: boolean;

  /** Where to redirect authenticated users if `unauthenticatedOnly` is set to true
   *
   * @default undefined
   */
  navigateAuthenticatedTo?: string;

  /** Where to redirect unauthenticated users if this page is protected
   *
   * @default undefined
   */
  navigateUnauthenticatedTo?: string;
};

// @ts-expect-error - #app not defined
declare module "#app" {
  interface PageMeta {
    auth?: MiddlewareMeta;
  }
}

declare module "vue-router" {
  interface RouteMeta {
    auth?: MiddlewareMeta;
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const metaAuth: MiddlewareMeta = to.meta.auth;

  if (!metaAuth) {
    return;
  }

  const { loggedIn } = useAuth();

  if (!loggedIn.value) {
    // the page is only for users that are not logged in (e.g.: login page)
    if (metaAuth.unauthenticatedOnly) {
      return navigateTo(metaAuth.navigateAuthenticatedTo ?? "/");
    }

    return;
  }

  /**
   * We do not want to enforce protection on `404` pages (unless the user opts out of it by setting `allow404WithoutAuth: false`).
   *
   * This is to:
   * - improve UX and DX: Having to log-in to see a `404` is not pleasent,
   * - avoid the `Error [ERR_HTTP_HEADERS_SENT]`-error that occurs when we redirect to the sign-in page when the original to-page does not exist. Likely related to https://github.com/nuxt/framework/issues/9438
   *
   */
  const matchedRoute = to.matched.length > 0;
  if (!matchedRoute) {
    // Hands control back to `vue-router`, which will direct to the `404` page
    return;
  }

  //  user is not logged in, check if he can access page
  if (metaAuth.authenticatedOnly) {
    return navigateTo(metaAuth.navigateUnauthenticatedTo ?? "/login");
  }
});
