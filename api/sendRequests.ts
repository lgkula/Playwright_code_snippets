import { request, expect, APIResponse } from '@playwright/test';
import {
    checkIfFileExists,
    readTestDataFromJsonFile,
} from '../jsonFileController';
import { getAuthToken } from './apiToken';

export const getGetNotesResponse = async (bodyData): Promise<any[]> => {
    const accessTokenObjectFilePath = '../playwright/.auth/accessToken.json';

    if (!(await checkIfFileExists(accessTokenObjectFilePath))) {
        await getAuthToken();
    }

    const apiUrl: string = `${process.env.ENFORCEMENT_GLOBAL_API_URL}Note/get-notes`;
    const context = await request.newContext();

    const sendPostRequest = async (bodyData): Promise<APIResponse> => {
        const authorizationHeaders = await readTestDataFromJsonFile(
            accessTokenObjectFilePath,
        );
        const requestData: any = {
            headers: authorizationHeaders,
            data: bodyData,
        };
        return await context.post(apiUrl, requestData);
    };

    let response = await sendPostRequest(bodyData);

    if (response.status() >= 400) {
        await getAuthToken();
        response = await sendPostRequest(bodyData);
    }

    expect(
        response.status(),
        'Checking that the endpoint is working and returning status code 200 in response',
    ).toBe(200);

    return await response.json();
};
