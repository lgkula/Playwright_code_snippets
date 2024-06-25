import { expect } from '@playwright/test';
import { CasesDataSet } from '../types/CasesData';
import { getBasicCaseDataResponse } from './legalEnforcementHelperApiResponses';

interface ChoseCasesToUse {
    useFirstCase?: boolean;
    useSecondCase?: boolean;
    useThirdCase?: boolean;
    useFourthCase?: boolean;
}

export const prepareDataToTest = async ({
    useFirstCase = true,
    useSecondCase = true,
    useThirdCase = true,
    useFourthCase = true,
}: ChoseCasesToUse) => {
    let casesDataSet: CasesDataSet = {} as CasesDataSet;
    const providedCasesId: number[] =
        process.env.CASES_ID?.split(',').map(Number) ?? [];
    if (providedCasesId.length !== 4) {
        throw new Error(
            'The number of Case Id given for use in the test is different from 4',
        );
    }
    let numberOfCasesToUse: number = 0;
    const casesIdChosenToUse: number[] = [];
    if (useFirstCase) {
        casesIdChosenToUse.push(providedCasesId[0]);
        numberOfCasesToUse++;
    }
    if (useSecondCase) {
        casesIdChosenToUse.push(providedCasesId[1]);
        numberOfCasesToUse++;
    }
    if (useThirdCase) {
        casesIdChosenToUse.push(providedCasesId[2]);
        numberOfCasesToUse++;
    }
    if (useFourthCase) {
        casesIdChosenToUse.push(providedCasesId[3]);
        numberOfCasesToUse++;
    }

    if (process.env.CASES_API === 'TRUE') {
        casesDataSet = await getBasicCaseDataResponse(casesIdChosenToUse);
    } else {
        if (
            !process.env.CASES_NO ||
            process.env.CASES_NO === '' ||
            process.env.CASES_NO === ' '
        ) {
            throw new Error(
                'CASES_API environment variable is not set to TRUE and Case Numbers are not specified in the CASES_NO environment variable',
            );
        }

        const providedCasesNumber: string[] =
            process.env?.CASES_NO?.split(',').map((item) => item.trim()) ?? [];
        if (providedCasesNumber.length !== 4) {
            throw new Error(
                'The number of Case Number given for use in the test is different from 4',
            );
        }
        const casesNoChosenToUse: string[] = [];
        if (useFirstCase) {
            casesNoChosenToUse.push(providedCasesNumber[0]);
        }
        if (useSecondCase) {
            casesNoChosenToUse.push(providedCasesNumber[1]);
        }
        if (useThirdCase) {
            casesNoChosenToUse.push(providedCasesNumber[2]);
        }
        if (useFourthCase) {
            casesNoChosenToUse.push(providedCasesNumber[3]);
        }
        casesDataSet.casesId = casesIdChosenToUse;
        casesDataSet.casesNumber = casesNoChosenToUse;
    }
    expect(
        casesDataSet.casesId.length,
        `Checking that data set for test contains ${numberOfCasesToUse} cases id`,
    ).toBe(numberOfCasesToUse);
    expect(
        casesDataSet.casesNumber.length,
        `Checking that data set for test contains ${numberOfCasesToUse} cases number`,
    ).toBe(numberOfCasesToUse);

    return casesDataSet;
};
