import { request, expect } from '@playwright/test';
import { GetMassPaymentsFeeResponse } from '../types/GetMassPaymentsFeeResponse';

export const getMassPaymentsFeeResponse = async (
    caseIds: number[],
    employeeId: number,
): Promise<GetMassPaymentsFeeResponse[]> => {
    const apiUrl: string = `${
        process.env.ENFORCEMENT_HELPER_API_URL
    }fees?caseIds=${caseIds[0]}${caseIds
        .slice(1)
        .map((num) => `&caseIds=${num}`)
        .join('')}&employeeId=${employeeId}`;

    const context = await request.newContext({ ignoreHTTPSErrors: true });
    const response = await context.get(apiUrl);
    // const responseBodyJSON = await response.json();
    expect(response.status()).toBe(200);

    return await response.json();
};
