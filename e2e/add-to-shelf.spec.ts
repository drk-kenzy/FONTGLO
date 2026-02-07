import { test, expect } from '@playwright/test';

test('search -> view details -> add edition to shelf', async ({ page }) => {
  // Create a shelf first
  await page.goto('/my-shelves');
  await page.fill('input[placeholder="Nouvelle étagère"]', 'E2E Shelf');
  await page.click('button:has-text("Créer")');
  await expect(page.locator('button:has-text("E2E Shelf")')).toBeVisible({ timeout: 5000 });

  // Search for a book
  await page.goto('/search');
  await page.fill('input[placeholder="Rechercher un livre, un auteur..."]', 'Pride and Prejudice');
  await page.keyboard.press('Enter');

  // Wait for results and open details of the first item
  await expect(page.locator('button:has-text("Détails")').first()).toBeVisible({ timeout: 10000 });
  await page.click('button:has-text("Détails")');

  // Wait for modal and switch to Editions
  await expect(page.locator('h3').first()).toBeVisible({ timeout: 5000 });
  await page.click('button:has-text("Éditions")');

  // Wait for editions to load (Voir link appears) and add the first edition to the shelf
  await expect(page.locator('a:has-text("Voir")').first()).toBeVisible({ timeout: 10000 });
  const select = page.locator('select').first();
  await select.selectOption({ label: 'E2E Shelf' });

  // Expect toast to appear
  await expect(page.locator('text=Livre ajouté')).toBeVisible({ timeout: 5000 });

  // Verify in My Shelves
  await page.goto('/my-shelves');
  await page.click('button:has-text("E2E Shelf")');
  await expect(page.locator('text=Pride and Prejudice').first()).toBeVisible({ timeout: 5000 });
});
