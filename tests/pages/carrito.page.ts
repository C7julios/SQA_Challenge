import { Page, expect } from "@playwright/test";

export class CarritoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/cart/");
  }

  async validateCart(products: { name: string | null; price: string }[]) {
    const items = this.page.locator(".cart_item");
    await expect(items).toHaveCount(products.length);

    for (let i = 0; i < products.length; i++) {
      const name = await items.nth(i).locator(".product-name a").textContent();
      const price = await items.nth(i).locator(".product-price").innerText();

      expect(name?.trim()).toContain(products[i].name?.trim() || "");
      expect(price.replace(/\./g, "")).toContain(
        products[i].price.replace(/\./g, "")
      );
    }

    const subtotal = await this.page.locator(".cart-subtotal .amount").innerText();
    const numericSubtotal = parseInt(subtotal.replace(/[^0-9]/g, ""));

    const expectedSum = products
      .map((p) => parseInt(p.price.replace(/[^0-9]/g, "")))
      .reduce((a, b) => a + b, 0);

    expect(Math.abs(numericSubtotal - expectedSum)).toBeLessThanOrEqual(5);
  }
}