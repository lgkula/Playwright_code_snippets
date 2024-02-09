import { Page } from '@playwright/test';

export const scrollRightHorizontalTableScroll = async (page: Page) => {
    await page.evaluate(() => {
        const scrollingDiv = document.querySelector(
            '[data-testid="cases-for-recommendations-grid"] [class="ag-body-horizontal-scroll-viewport"]',
        );

        if (scrollingDiv) scrollingDiv.scrollLeft = 300;
    });
};

export const scrollLeftHorizontalTableScroll = async (page: Page) => {
    await page.evaluate(() => {
        const scrollingDiv = document.querySelector(
            '[data-testid="cases-for-recommendations-grid"] [class="ag-body-horizontal-scroll-viewport"]',
        );

        if (scrollingDiv) scrollingDiv.scrollLeft = -300;
    });
};
