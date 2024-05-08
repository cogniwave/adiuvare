import { eventHandler } from "h3";

// todo: use this blacklist on token validation
const TOKEN_BLACKLIST = [];

export default eventHandler((event) => {
  // blacklist tokens
  TOKEN_BLACKLIST.push(getCookie(event, "auth:access"));
  TOKEN_BLACKLIST.push(getCookie(event, "auth:refresh"));

  // delete cookies
  deleteCookie(event, "auth:access");
  deleteCookie(event, "auth:refresh");
  return { status: "OK" };
});
