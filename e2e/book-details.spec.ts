import { test, expect } from '@playwright/test';

test('search and add to shelf', async ({ page }) => {
  // create a shelf
  await page.goto('/my-shelves');
  await page.getByRole('button', { name: /Créer une étagère/i }).click();
  await page.getByPlaceholder('Nom de l\'étagère').fill('E2E Test');
  await page.getByRole('button', { name: /Créer/i }).click();

  // search
  await page.goto('/search');
  await page.getByPlaceholder('Rechercher').fill('Pride and Prejudice');
  await page.getByRole('button', { name: /Rechercher/i }).click();

  // Wait for results and open details of first book
  await page.locator('[data-testid="openlib-book-card"]').first().getByRole('button', { name: /Détails/i }).click();

  // Switch to editions tab
  await page.getByRole('button', { name: /Éditions/i }).click();

  // Add first edition to shelf via select
  const select = page.locator('select').first();
  await select.selectOption({ label: 'E2E Test' });

  // Check toast appears
  await expect(page.getByText(/Livre ajouté/i)).toBeVisible();

  // Check /my-shelves contains the book
  await page.goto('/my-shelves');
  await expect(page.getByText(/Pride and Prejudice/i)).toBeVisible();
});
