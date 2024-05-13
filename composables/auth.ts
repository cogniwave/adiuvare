import { useRouter } from "vue-router";

import type { LoginPayload, LoginResult, TokenUser } from "@/types/user";

const REFRESH_INTERVAL = 240000; // 4 minutes, 1 less than token duration

let interval: NodeJS.Timeout | null = null;

export const useAuth = () => {
  const $router = useRouter();
  const storageUser = useLocalStorage<TokenUser>("qa:user", null, {
    writeDefaults: false,
    serializer: {
      read: (val) => (val ? JSON.parse(val) : null),
      write: (val) => JSON.stringify(val),
    },
  });

  const loggedIn = computed<boolean>(() => !loading.value && !!data.value);

  // Re-construct state from cookie, also setup a cross-component sync via a useState hack, see https://github.com/nuxt/nuxt/issues/13020#issuecomment-1397282717
  const _accessTokenCookie = useCookie<string | null>("auth:access", {
    default: () => null,
    maxAge: 300,
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  const _refreshTokenCookie = useCookie<string | null>("auth:refresh", {
    default: () => null,
    maxAge: 300,
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  const data = useState<TokenUser | undefined | null>("auth:data", () => undefined);

  // If session exists, initialize as not loading
  const loading = useState<boolean>("auth:loading", () => true);

  const token = useState("auth:access", () => _accessTokenCookie.value);

  const refreshToken = useState("auth:refresh", () => _refreshTokenCookie.value);

  const _reset = () => {
    data.value = null;
    token.value = null;
    refreshToken.value = null;
    _accessTokenCookie.value = null;
    _refreshTokenCookie.value = null;
    storageUser.value = null;

    if (interval) {
      clearInterval(interval);
    }
  };

  // make request to refresh, update tokens
  const refresh = async () => {
    loading.value = true;

    if (!refreshToken.value) {
      _reset();
      $router.push("/");
      loading.value = false;
      return false;
    }

    try {
      const { data: result } = await useFetch<string>("/api/v1/auth/refresh", {
        method: "post",
        body: { token: refreshToken.value },
      });

      if (!result.value) {
        logout();
        return false;
      }

      token.value = result.value;
      _accessTokenCookie.value = result.value;

      return true;
    } catch (err) {
      logout();
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (payload: LoginPayload) => {
    loading.value = true;
    const { data: result } = await useFetch<LoginResult>("/api/v1/auth/login", {
      method: "post",
      body: payload,
    });

    if (!result.value) {
      return;
    }

    token.value = result.value.accessToken;
    refreshToken.value = result.value.refreshToken;
    data.value = result.value.user;
    loading.value = false;
    storageUser.value = result.value.user;

    // refresh token every REFRESH_INTERVAL
    interval = setInterval(refresh, REFRESH_INTERVAL);
    loading.value = false;

    $router.replace("/");
  };

  // make request to logout, update tokens
  const logout = async () => {
    loading.value = true;

    _reset();
    try {
      await $fetch("/api/v1/auth/logout", { method: "delete" });
      loading.value = false;

      if ($router.currentRoute.value.path !== "/") {
        $router.replace("/");
      }
    } catch (err) {
      console.warn("failed to refresh", err);
      window.location.reload();
    }
  };

  watch(token, (tkn) => tkn.value && (_accessTokenCookie.value = tkn.value));

  watch(refreshToken, (tkn) => tkn.value && (_refreshTokenCookie.value = tkn.value));

  // When the page is cached on a server, set the token on the client
  if (_accessTokenCookie.value && !token.value) {
    token.value = _accessTokenCookie.value;
    refreshToken.value = _refreshTokenCookie.value;
  } else if (_refreshTokenCookie.value && (!refreshToken.value || !token.value)) {
    refresh();
  }

  if (!interval && token.value && storageUser.value) {
    data.value = storageUser.value;

    // refresh token every REFRESH_INTERVAL
    interval = setInterval(refresh, REFRESH_INTERVAL);
    loading.value = false;
  }

  return { data, loggedIn, token, refreshToken, loading, logout, login, refresh };
};
