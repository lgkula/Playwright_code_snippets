import { ConnectionPool } from "mssql";
import { connect } from "./connect";
import { writeResultToFile } from "./utils/writeResultToFile";

export const queryResultToFileFromDelfinDatabase = async (
  sqlQuery: string,
  filePath: string
) => {
  let connection: ConnectionPool;
  try {
    connection = await connect();
    const result = await connection.request().query(sqlQuery);

    await writeResultToFile(result, filePath);
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
