import { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
  }

  async goToAmorCategory() {
    await this.page.locator('#primary-menu').getByRole('link', { name: 'Amor' }).click();
    /* await this.page.locator("a[href*='categoria/amor']").first().click();*/
  }
}

/*await page.locator('#primary-menu').getByRole('link', { name: 'Amor' }).click();*/