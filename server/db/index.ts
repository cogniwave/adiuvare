import pg from "pg";

const pool = new pg.Pool();

export default async (query: string, params?: any[]) => {
  return await pool.query(query, params);
};
