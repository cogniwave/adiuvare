import { getUserById } from "@/server/db/users";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const id = getRouterParam(event, "id") as string;

  const user = getSessionUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: "errors.unexpected" }));
    return;
  }

  try {
    const user = await getUserById(id);

    if (user) {
      return user;
    }

    setResponseStatus(event, 404);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[user] couldnt get user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
