// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('I Spy app smoke', () => {
  test('main menu loads and first scene opens with object list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-menu')).toBeVisible();
    await expect(page.locator('#scene-selection')).toBeVisible();

    // Click first scene button (animalfarm)
    const firstScene = page.locator('.scene-btn[data-scene="animalfarm"]').first();
    await firstScene.click();

    // Game screen should be visible
    await expect(page.locator('#game-screen')).toBeVisible({ timeout: 5000 });
    // "Find These!" or equivalent (i18n)
    await expect(page.getByText(/Find These|Encuentra|खोजें|找到|Encontra/i)).toBeVisible({ timeout: 3000 });
    // Object list (sidebar) should have at least one item
    const listItems = page.locator('#target-list .target-item');
    await expect(listItems.first()).toBeVisible({ timeout: 5000 });
    const count = await listItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
