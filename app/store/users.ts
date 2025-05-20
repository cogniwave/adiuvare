import type { User } from "shared/types/user";

// type AnyPost = Post | userstateTogglePayload | PostDeletePayload | EmptyPost;
type AnyUser = User;


function isUser(val: unknown): val is User {
  return !!val && typeof val === "object" && "id" in val && "email" in val && "name" in val;
}

export const useUsers = <T = AnyUser>() => {
  const users = useState<User[]>("users:users", () => []);
  const currUser = useState<T | null>("users:current", () => null as T | null);
  
  const setUser = (user: T | null) => (currUser.value = user);
  
  const user = computed(() => currUser.value);
  const loggedIn = computed(() => isUser(currUser.value) && !!currUser.value.id);
  const ready = computed(() => currUser.value !== null);
  const clear = () => setUser(null);
  
  return {
    users,
    currUser,
    setUser,
    clear,
    user,
    loggedIn,
    ready,
  };
};

/* export const useUsers = <T = AnyUser>() => {
  const users = useState<User[]>("users:users", () => []);
  const currUser = useState<T>("users:current", () => ({}) as T);

  const setUser = (user: T | null) => (currUser.value = user as T);

  return { currUser, users, setUser };
};
 */