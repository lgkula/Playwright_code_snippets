import { ConnectionPool } from "mssql";
import { connect } from "./connect";
import { writeResultToFile } from "./utils/writeResultToFile";

export const queryResultFromDelfinDatabase = async (
  sqlQuery: string,
) => {
  let connection: ConnectionPool;
  try {
    connection = await connect();
    const result = await connection.request().query(sqlQuery);

    return result.recordset;
  } catch (error) {
    console.error(
      "Error connecting to the database or executing the query:",
      error
    );
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};
