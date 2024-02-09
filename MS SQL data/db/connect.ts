import { ConnectionPool } from "mssql";
import { db_config } from "./db_config";

export const connect = async (): Promise<ConnectionPool> => {
  const connection = new ConnectionPool(db_config);
  await connection.connect();

  console.log("Connected to the database");
  return connection;
};
