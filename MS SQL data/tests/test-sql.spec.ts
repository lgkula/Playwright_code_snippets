import { test, expect } from "@playwright/test";
import { queryResultFromDelfinDatabase } from "../db/queryResultFromDatabase";
import { queryResultToFileFromDelfinDatabase } from "../db/queryResultToFileFromDatabase";

test('Test1', async ({ page }) => {
  const sqlQuery =
    "SELECT TOP (10) [ssd_ID],[ssd_CalyNumerSprawy] FROM [Delfin].[dbo].[DEL_TB_Sprawa_SAD]";
  const dbResult = await queryResultFromDelfinDatabase(sqlQuery);

  console.log("dbResult: ", dbResult);

  const filePath = "test-data/output.data.ts";
  queryResultToFileFromDelfinDatabase(sqlQuery, filePath);
  await expect(0).toEqual(0);
})
