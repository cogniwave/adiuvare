import query from "./";

export const getPosts = async () => {
  const result = await query(
    "SELECT * FROM posts ORDER BY createdBy DESC LIMIT 50",
  );

  return result.rows || [];
};
