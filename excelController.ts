import { expect } from '@playwright/test';
import path from 'path';
import * as XLSX from 'xlsx';
import { ExportedRecommendation } from '../types/ExportedRecommendation';

export const readExcelFile = (
    excelFilePath: string,
): ExportedRecommendation[] => {
    const excelFile = XLSX.readFile(path.join(__dirname, excelFilePath));
    const excelFirstSheet = excelFile.Sheets[excelFile.SheetNames[0]];
    const recommendationsDataFromExcelFile: ExportedRecommendation[] =
        XLSX.utils.sheet_to_json(excelFirstSheet);
    expect(recommendationsDataFromExcelFile).not.toBeNull();
    return recommendationsDataFromExcelFile;
};

export const writeExcelFile = (
    jsonData: object[],
    excelFilePath: string,
): void => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, path.join(__dirname, excelFilePath));
};
