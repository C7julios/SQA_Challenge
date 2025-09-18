import { Page, expect } from "@playwright/test";

export class ProductoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getName(): Promise<string | null> {
    return this.page.locator("h1.product_title").textContent();
  }

  async getPrice(): Promise<string> {
    return this.page.locator(".price").innerText();
  }

  async addToCart() {
    const [response] = await Promise.all([
      this.page.waitForResponse((res) =>
        res.url().includes("wc-ajax=add_to_cart") && res.status() === 200
      ),
      this.page.locator("button.single_add_to_cart_button").click(),
    ]);

    const json = await response.json();
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    expect(json).toHaveProperty("fragments");

    return json;
  }
}