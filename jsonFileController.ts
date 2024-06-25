import * as fs from 'node:fs/promises';
import path from 'path';
import { expect } from '@playwright/test';
import { pwLogger } from './pwLogger';

export const removeOldFile = async (fullFilePath: string): Promise<void> => {
    await fs.rm(fullFilePath, { force: true });
};

export const writeObjectToFile = async (
    objectToSave: object,
    filePath: string,
): Promise<void> => {
    const fullFilePath = path.join(__dirname, `${filePath}`);

    if (Object.keys(objectToSave).length !== 0) {
        await removeOldFile(fullFilePath);
        // if (objectToSave !== {}) {
        await fs.appendFile(
            fullFilePath,
            JSON.stringify(objectToSave, null, 2),
            'utf-8',
        );
        // await fs.access(filePath);
        expect(
            await checkIfFileExists(fullFilePath),
            `Check that file ${filePath} exist`,
        ).toBeTruthy();
    } else {
        pwLogger('No new data, new object not saved to file', 'info', 'all');
    }
};

export const writeResponseToFile = async (
    response: object[],
    fileName: string,
    keepOldData: boolean = false,
): Promise<void> => {
    const filePath = `../test-data/${fileName}`;
    const fullFilePath = path.join(__dirname, `${filePath}`);

    if (!keepOldData) {
        await removeOldFile(fullFilePath);
    }
    if (response.length > 0) {
        await fs.appendFile(
            fullFilePath,
            JSON.stringify(response, null, 2),
            'utf-8',
        );
        // await fs.access(filePath);
        expect(
            await checkIfFileExists(fullFilePath),
            `Check that file ${filePath} exist`,
        ).toBeTruthy();
    } else {
        pwLogger('No cases data to write in file', 'error', 'important');
    }
};

export const readTestDataFromJsonFile = async (fileName: string) => {
    const filePath = `../test-data/${fileName}`;
    const fullFilePath = path.join(__dirname, `${filePath}`);
    let objectData: object[];
    expect(
        await checkIfFileExists(fullFilePath),
        `Check that file ${filePath} exist`,
    ).toBeTruthy();

    try {
        const data = await fs.readFile(fullFilePath, 'utf-8');
        objectData = JSON.parse(data);
    } catch (error) {
        console.error('An error occurred while reading the file:', error);
    }
    return objectData;
};

export const readJsonFile = async (filePath: string): Promise<object> => {
    const fullFilePath = path.join(__dirname, `${filePath}`);
    let objectData: object;
    expect(
        await checkIfFileExists(fullFilePath),
        `Check that file ${filePath} exist`,
    ).toBeTruthy();

    try {
        const data = await fs.readFile(fullFilePath, 'utf-8');
        objectData = JSON.parse(data);
    } catch (error) {
        console.error('An error occurred while reading the file:', error);
    }
    return objectData;
};

export const writeQueryResultToFile = async (
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

        pwLogger(
            `Number of records imported from the database: ${response.length}`,
            'info',
            'all',
        );
    } else {
        pwLogger('No records', 'error', 'important');
    }
};

export const checkIfFileExists = async (
    fullFilePath: string,
): Promise<boolean> => {
    try {
        await fs.access(fullFilePath);
        return true;
    } catch (error) {
        return false;
    }
};
