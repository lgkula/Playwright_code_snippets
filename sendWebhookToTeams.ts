import { expect } from '@playwright/test';

export const sendWebhookToTeams = async ({ request }) => {
    expect(true).toBeTruthy();
    const response = await request.post(
        'https://krukeu.webhook.office.com/webhookb2/65cfa9c4-ed51-4f67-a877-f1a6b634f4d0@964180d6-298a-43d5-b71d-d4cee877d4b4/IncomingWebhook/e5c366e7b5744eaa8d43fdbf8c1c130e/54ed90ec-dcdd-4548-aa9c-1e1beede2c39',
        {
            data: {
                text: 'Próba użycia webhooka',
            },
        },
    );
    expect(response.status()).toBe(200);
    // const responseBodyText = await response.text();
};
