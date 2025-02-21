import { eventHandler } from "h3";

// todo: use this blacklist on token validation
const TOKEN_BLACKLIST: string[] = [];

export default eventHandler((event) => {
  // blacklist tokens
  TOKEN_BLACKLIST.push(getCookie(event, "auth:token")!);
  TOKEN_BLACKLIST.push(getCookie(event, "auth:refresh")!);

  // delete cookies
  deleteCookie(event, "auth:token");
  deleteCookie(event, "auth:refresh");
  return { status: "OK" };
});
