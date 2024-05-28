import type { CookieRef } from "#app";
import { useRouter, useRoute } from "vue-router";

import type { LoginPayload, LoginResult, TokenUser } from "@/types/user";

type SessionData = TokenUser;

type UseAuthStateReturn = {
  token: ComputedRef<string | null>;
  loggedIn: ComputedRef<boolean>;
  rawToken: CookieRef<string | null>;
  setToken: (newToken: string | null) => void;
  setRefreshToken: (newToken: string | null) => void;
  setUser: (user: SessionData | null) => void;
  rawRefreshToken: CookieRef<string | null>;
  refreshToken: ComputedRef<string | null>;
  loading: Ref<boolean>;
  data: Ref<SessionData | null>;
  logout: typeof logout;
  login: typeof login;
  refreshUser: () => void;
};

const REFRESH_INTERVAL = 240000; // 4 minutes, 1 less than token duration

let interval: NodeJS.Timeout | null = null;

const startInterval = () => {
  if (!interval) {
    console.debug("start interval");
    interval = setInterval(refresh, REFRESH_INTERVAL);
  }
};

// make request to refresh, update tokens
const refresh = async () => {
  const { loading, refreshToken, data, setToken, refreshUser } = useAuth();

  loading.value = true;

  if (!refreshToken.value) {
    loading.value = false;
    return false;
  }

  try {
    const result = await $fetch<string>("/api/v1/auth/refresh", {
      method: "post",
      body: { token: refreshToken.value },
    });

    if (!result) {
      logout();
      return false;
    }

    setToken(result);
    if (!data.value) {
      refreshUser();
    }

    startInterval();

    return true;
  } catch (err) {
    logout();
    return false;
  } finally {
    loading.value = false;
  }
};

const login = async (payload: LoginPayload) => {
  const { loading, setToken, setRefreshToken, setUser } = useAuth();

  loading.value = true;
  const result = await $fetch<LoginResult>("/api/v1/auth/login", {
    method: "post",
    body: payload,
  });

  if (!result) {
    loading.value = false;
    return;
  }

  setToken(result.accessToken);
  setRefreshToken(result.refreshToken);
  setUser(result.user);

  loading.value = false;

  startInterval();
  loading.value = false;
};

// make request to logout, update tokens
const logout = async () => {
  const $route = useRoute();
  const $router = useRouter();
  const { loading, setToken, setRefreshToken, setUser } = useAuth();
  loading.value = true;

  try {
    await $fetch("/api/v1/auth/logout", { method: "delete" });
    loading.value = false;

    setToken(null);
    setRefreshToken(null);
    setUser(null);

    if (interval) {
      clearInterval(interval);
    }

    if ($route.path !== "/") {
      $router.replace("/");
    }
  } catch (err) {
    console.warn("failed to refresh", err);
    window.location.reload();
  }
};

export const useAuth = (): UseAuthStateReturn => {
  const data = useState<SessionData | null>("auth:data", () => null);
  const storageUser = useLocalStorage<TokenUser>("qa:user", null, {
    writeDefaults: false,
    serializer: {
      read: (val) => (val ? JSON.parse(val) : null),
      write: (val) => JSON.stringify(val),
    },
  });

  // If session exists, initialize as not loading
  const loading = useState<boolean>("auth:loading", () => true);
  const loggedIn = computed<boolean>(() => !loading.value && !!data.value);

  // Re-construct state from cookie, also setup a cross-component sync via a useState hack, see https://github.com/nuxt/nuxt/issues/13020#issuecomment-1397282717
  const _rawTokenCookie = useCookie<string | null>("auth:token", {
    default: () => null,
    maxAge: 300,
    sameSite: "lax",
    secure: true,
  });

  const rawToken = useState("auth:raw-token", () => _rawTokenCookie.value);
  watch(rawToken, () => {
    _rawTokenCookie.value = rawToken.value;
    refreshUser();
  });

  const token = computed(() => rawToken.value);

  const setToken = (newToken: string | null) => (rawToken.value = newToken);

  const setRefreshToken = (newToken: string | null) => (rawRefreshToken.value = newToken);

  // Re-construct state from cookie, also setup a cross-component sync via a useState hack, see https://github.com/nuxt/nuxt/issues/13020#issuecomment-1397282717
  const _rawRefreshTokenCookie = useCookie<string | null>("auth:refresh", {
    default: () => null,
    maxAge: 300,
    sameSite: "lax",
    secure: true,
  });

  const rawRefreshToken = useState("auth:raw-refresh-token", () => _rawRefreshTokenCookie.value);

  watch(rawRefreshToken, () => {
    _rawRefreshTokenCookie.value = rawRefreshToken.value;
    refreshUser();
  });

  const refreshToken = computed(() => {
    if (rawRefreshToken.value === null) {
      return null;
    }

    return rawRefreshToken.value;
  });

  const setUser = (user: SessionData | null) => {
    data.value = user;
    storageUser.value = user;
  };

  const refreshUser = () => {
    if (storageUser.value) {
      data.value = storageUser.value;
    }
  };

  onNuxtReady(() => {
    if (token.value) {
      refreshUser();
      startInterval();
    }

    loading.value = false;
  });

  return {
    data,
    token,
    rawToken: readonly(rawToken),
    refreshToken,
    loading,
    rawRefreshToken: readonly(rawRefreshToken),
    loggedIn,
    setToken,
    setRefreshToken,
    setUser,
    logout,
    refreshUser,
    login,
  };
};
