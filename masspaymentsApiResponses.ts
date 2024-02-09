import { Page } from '@playwright/test';
import { UserResponse } from '../types/UserResponse';

interface GetRecommendationsResponse {
    LastValidationStartTime: string;
}
interface GetUserResponse {
    UserId: number;
    Username: string;
}

export const lastValidationErrorsTimeFromResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
    originalDate: Date = new Date('1970-01-01T00:00:00'),
): Promise<Date> => {
    let lastValidationStartTimeFromResponse: Date;
    do {
        const getRecommendationsResponsePromise = page.waitForResponse(
            '**/api/Recommendations/GetRecommendations',
        );
        await initiatorFunction();
        const getRecommendationsResponse =
            await getRecommendationsResponsePromise;

        const getRecommendationsResponseBodyJson: GetRecommendationsResponse =
            (await getRecommendationsResponse.json()) as GetRecommendationsResponse;
        lastValidationStartTimeFromResponse = new Date(
            getRecommendationsResponseBodyJson.LastValidationStartTime,
        );
        if (
            originalDate.getTime() ===
            lastValidationStartTimeFromResponse.getTime()
        ) {
            console.log('Waiting 30s for another error validation');
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(30_000);
        }
    } while (
        originalDate.getTime() === lastValidationStartTimeFromResponse.getTime()
    );
    return lastValidationStartTimeFromResponse;
};

export const deleteRecommendationsResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<string> => {
    const deleteRecommendationsResponsePromise = page.waitForResponse(
        '**/api/Recommendations/DeleteRecommendations',
    );
    await initiatorFunction();
    const deleteRecommendationsResponse =
        await deleteRecommendationsResponsePromise;

    return await deleteRecommendationsResponse.text();
};

export const addRecommendationsResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<string> => {
    const addRecommendationsResponsePromise = page.waitForResponse(
        '**/api/Recommendations/AddRecommendations',
    );
    await initiatorFunction();
    const addRecommendationsResponse = await addRecommendationsResponsePromise;

    return await addRecommendationsResponse.text();
};

export const recommendationLockerResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<string> => {
    const recommendationLockerResponsePromise = page.waitForResponse(
        '**/api/Recommendations/RecommendationLocker',
    );
    await initiatorFunction();
    const recommendationLockerResponse =
        await recommendationLockerResponsePromise;

    return await recommendationLockerResponse.text();
};

export const getTodayPaymentLimitAndAddedPaymentsValueResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<{
    todayPaymentLimitFromApi: number;
    addedPaymentsValueFromApi: number;
}> => {
    const getTodayPaymentLimitResponsePromise = page.waitForResponse(
        '**/api/Payments/GetTodayPaymentLimit',
    );
    const getAddedPaymentsValueResponsePromise = page.waitForResponse(
        '**/api/Payments/GetAddedPaymentsValue',
    );
    await initiatorFunction();

    const getTodayPaymentLimitResponse =
        await getTodayPaymentLimitResponsePromise;
    const getTodayPaymentLimitResponseText: string =
        await getTodayPaymentLimitResponse.text();

    const getAddedPaymentsValueResponse =
        await getAddedPaymentsValueResponsePromise;
    const getAddedPaymentsValueResponseText: string =
        await getAddedPaymentsValueResponse.text();

    return {
        todayPaymentLimitFromApi: Number(getTodayPaymentLimitResponseText),
        addedPaymentsValueFromApi: Number(getAddedPaymentsValueResponseText),
    };
};

export const addPaymentsResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<string> => {
    const addPaymentsResponsePromise = page.waitForResponse(
        '**/api/Payments/AddPayments',
    );
    await initiatorFunction();
    const addPaymentsResponseResponse = await addPaymentsResponsePromise;

    return await addPaymentsResponseResponse.text();
};

export const getUserResponse = async (
    initiatorFunction: () => Promise<void>,
    page: Page,
): Promise<UserResponse> => {
    const getUserResponsePromise = page.waitForResponse('**/api/User/GetUser');
    await initiatorFunction();
    const getUserResponse = await getUserResponsePromise;

    const getUserResponseBodyJson: GetUserResponse =
        (await getUserResponse.json()) as GetUserResponse;

    return mapGetUserResponseToUserResponse(getUserResponseBodyJson);
};

const mapGetUserResponseToUserResponse = (
    data: GetUserResponse,
): UserResponse => {
    return {
        userId: `${data.UserId}`,
        userName: data.Username,
    };
};
