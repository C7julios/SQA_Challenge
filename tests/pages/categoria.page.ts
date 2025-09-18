import { Page } from "@playwright/test";

export class CategoriaPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectFirstTwoProducts(): Promise<string[]> {
    const links = this.page.locator(".product-title a");
    const count = await links.count();
    const selected: string[] = [];
    for (let i = 0; i < Math.min(2, count); i++) {
      selected.push((await links.nth(i).getAttribute("href")) as string);
    }
    return selected;
  }
}