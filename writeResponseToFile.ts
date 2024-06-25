import * as fs from 'fs/promises';

const removeOldFile = async (filePath: string): Promise<void> => {
    await fs.rm(filePath, { force: true });
};

export const writeResponseToFile = async (
    response: any,
    filePath: string,
    keepOldData: boolean = false,
): Promise<void> => {
    const dataStringStart = 'export const DATA_SET = [';
    const dataStringEnd = '];';
    let dataStringMiddle = '';

    if (!keepOldData) {
        removeOldFile(filePath);
    }
    if (response.length > 0) {
        for (const row of response) {
            dataStringMiddle += `{caseId: ${row.id}, caseNumber: '${row.caseNumber}'},`;
        }

        await fs.appendFile(
            filePath,
            dataStringStart + dataStringMiddle + dataStringEnd,
            'utf-8',
        );

        console.log(
            'Number of records imported from the database: ' + response.length,
        );
    } else {
        console.log('No records');
    }
};
