import { Pool } from "https://deno.land/x/postgres@v0.14.3/mod.ts";

const CONCURRENT_CONNECTIONS = 2;
let connectionPool;
if (Deno.env.get("DATABASE_URL")) {
  connectionPool = new Pool(Deno.env.get("DATABASE_URL"), CONCURRENT_CONNECTIONS);
} else {
  connectionPool = new Pool({
    hostname: "abul.db.elephantsql.com",
    database: "oulciytt",
    user: "oulciytt",
    password: "rczznLuCgl8uL7qJ6T-fb1SinWpyiycC",
    port: 5432,
  }, CONCURRENT_CONNECTIONS);
}

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    if (client) {
      try {
        await client.release();
      } catch (e) {
        console.log("Unable to release database connection.");
        console.log(e);
      }
    }
  }

  return response;
};

export { executeQuery };