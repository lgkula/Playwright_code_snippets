import { CasesDataSet } from '../types/CasesData';

export const pushCasesDataToBrowser = async (
    context: any,
    casesData: CasesDataSet,
) => {
    if (!casesData) {
        throw new Error('Provide data for case data set to push to the browser.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await context.addInitScript((casesData: CasesDataSet) => {
        const numberCasesId: number = casesData.casesId.length;
        if (typeof window !== 'undefined') {
            (window as any).casesIds = {
                elements: casesData.casesId,
                length: numberCasesId,
                get: function (index: number) {
                    return this.elements[index];
                },
            };
            (window as any).casesNumbers = {
                elements: casesData.casesNumber,
                length: numberCasesId,
                get: function (index: number) {
                    return this.elements[index];
                },
            };
        } else {
            throw new Error(
                'It is not possible to assign casesIds and casesNumbers to window, because the window object does not exist in this context.',
            );
        }
    }, casesData);
};
