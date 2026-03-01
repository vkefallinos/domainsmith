import { test, expect } from '@playwright/test';

test.describe('Agent Management & Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/workspace/local%2Feducation/studio');
        await expect(page.locator('text=Agents').first()).toBeVisible();
    });

    test('should display agents in sidebar and allow agent selection', async ({ page }) => {
        // AssessmentAgent is an agent in education
        await expect(page.locator('text=AssessmentAgent').first()).toBeVisible();
        await page.locator('text=AssessmentAgent').first().click();

        // Check if the URL changed to the agent route
        await page.waitForURL(/\/workspace\/.*\/studio\/agent\/.*/);
    });

    test('should open agent chat when clicking Chat button', async ({ page }) => {
        await page.locator('text=AssessmentAgent').first().click();
        await page.waitForURL(/\/workspace\/.*\/studio\/agent\/.*/);

        // Click the Chat button
        const chatBtn = page.locator('button', { hasText: 'Chat' }).first();
        await chatBtn.click();

        // Verify chat modal opens
        await expect(page.locator('text=Runtime Conversation Preview').first()).toBeVisible({ timeout: 10000 });
    });
});
