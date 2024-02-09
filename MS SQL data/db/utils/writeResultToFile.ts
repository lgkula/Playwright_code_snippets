import * as fs from "fs/promises";

const removeOldFile = async (filePath: string): Promise<void> => {
  await fs.rm(filePath, { force: true });
};

export const writeResultToFile = async (
  result: any,
  filePath: string,
  keepOldData: boolean = false
): Promise<void> => {
  const dataStringStart = "export const DATA_SET = [";
  const dataStringEnd = "];";
  let dataStringMiddle = "";

  if (!keepOldData) {
    removeOldFile(filePath);
  }
  if (result.recordset.length > 0) {
    for (const row of result.recordset) {
      dataStringMiddle += `{caseId: ${row.ssd_ID}, caseNumber: '${row.ssd_CalyNumerSprawy}'},`;
    }

    await fs.appendFile(
      filePath,
      dataStringStart + dataStringMiddle + dataStringEnd,
      "utf-8"
    );

    console.log(
      "Number of records imported from the database: " + result.recordset.length
    );
  } else {
    console.log("No records");
  }
};
