import { request, expect, APIResponse } from '@playwright/test';
import {
    checkIfFileExists,
    readTestDataFromJsonFile,
} from '../jsonFileController';
import { getAuthToken } from './apiToken';

interface GetNotesResponse {
    caseId: number;
    id: number;
    typeId: number;
    date: string;
    creationDate: string;
    employeeId: number;
    content: string;
    attachmentId: number;
    extensionId: number;
}

export const sendRequest = async (
    method: 'get' | 'post',
    endpointUrl: string,
    bodyData?,
): Promise<GetNotesResponse[]> => {
    const accessTokenObjectFilePath = '../playwright/.auth/accessToken.json';

    if (!(await checkIfFileExists(accessTokenObjectFilePath))) {
        await getAuthToken();
    }

    const apiUrl: string = `${process.env.ENFORCEMENT_GLOBAL_API_URL}${endpointUrl}`;
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

    const sendGetRequest = async (): Promise<APIResponse> => {
        const authorizationHeaders = await readTestDataFromJsonFile(
            accessTokenObjectFilePath,
        );
        const requestData: any = {
            headers: authorizationHeaders,
        };
        return await context.post(apiUrl, requestData);
    };

    let response;
    if (method === 'post') {
        response = await sendPostRequest(bodyData);

        if (response.status() >= 400) {
            await getAuthToken();
            response = await sendPostRequest(bodyData);
        }
    } else {
        response = await sendGetRequest();

        if (response.status() >= 400) {
            await getAuthToken();
            response = await sendGetRequest();
        }
    }

    expect(
        response.status(),
        'Checking that the endpoint is working and returning status code 200 in response',
    ).toBe(200);

    return await response.json();
};
