import type { User } from "@/types/user";

// type AnyPost = Post | userstateTogglePayload | PostDeletePayload | EmptyPost;
type AnyUser = User;

export const useUsers = <T = AnyUser>() => {
  const users = useState<User[]>("users:users", () => []);
  const currUser = useState<T>("users:current", () => ({}) as T);

  const setUser = (user: T | null) => (currUser.value = user as T);

  return { currUser, users, setUser };
};
