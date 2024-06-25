import { request, expect, APIResponse } from '@playwright/test';
import {
    checkIfFileExists,
    readTestDataFromJsonFile,
} from '../jsonFileController';
import { getAuthToken } from './apiToken';

export const postXResponse = async (bodyData): Promise<any[]> => {
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

export const getXResponse = async (par: number[]): Promise<any[]> => {
    const apiUrl: string = `${
        process.env.API_URL
    }common/basic-case-data?caseIds=${par[0]}${par
        .slice(1)
        .map((num) => `&caseIds=${num}`)
        .join('')}`;
    const context = await request.newContext({ ignoreHTTPSErrors: true });
    const response = await context.get(apiUrl);
    expect(
        response.status(),
        'Checking that the endpoint is working and returning status code 200 in response',
    ).toBe(200);
    const responseJson: any[] = await response.json();
    expect(
        responseJson.length,
        'Checking that the number of objects in the answer matches the number of arguments given',
    ).toEqual(par.length);
    return mapXResponse(responseJson);
};

const mapXResponse = (data: any[]): any[] => {
    return data.map((item) => ({
        nowaNazwaPola: item.nazwaPolaApi,
        nowaNazwaPola1: item.nazwaPolaApi1,
    }));
};
