import { test, expect } from '@playwright/test';

test.describe('Workspace Knowledge Management', () => {
    test.beforeEach(async ({ page }) => {
        // Go directly to the studio of the local/education workspace
        await page.goto('/workspace/local%2Feducation/studio');
        // Ensure the studio is loaded
        await expect(page.locator('text=Knowledge').first()).toBeVisible();
    });

    test('should display knowledge domains and allow navigation', async ({ page }) => {
        // Check if the "Classroom Management" domain is visible
        await expect(page.locator('text=Classroom Management').first()).toBeVisible();

        // Click to expand or select it
        await page.locator('text=Classroom Management').first().click();

        // Expect to see some files/folders inside it, like "Class Size" or "large.md"
        await expect(page.locator('text=Class Size').first()).toBeVisible();
    });

    test('should open a markdown file in the editor', async ({ page }) => {
        await page.locator('text=Classroom Management').first().click();

        // Expand Class Size folder
        await page.locator('text=Class Size').first().click();

        // Click on large.md
        await page.locator('text=large.md').first().click();

        // Verify the editor is open (checking for some content or editor class)
        // The editor should show the markdown title or content.
        await expect(page.locator('.ProseMirror, textarea').first()).toBeVisible({ timeout: 10000 });
    });
});
