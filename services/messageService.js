import { executeQuery } from "../database/database.js";

const create = async (sender, message) => {
  await executeQuery(
    "INSERT INTO messages (sender, message) VALUES ($1, $2);",
    sender,
    message,
  );
};

const findLastFiveMessages = async () => {
  const result = await executeQuery(
    "SELECT * FROM messages ORDER BY id DESC LIMIT 5;",
  );
  return result.rows;
};

export { create, findLastFiveMessages };