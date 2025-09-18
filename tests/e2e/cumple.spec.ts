import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page.ts";
import { CategoriaPage } from "../pages/categoria.page.ts";
import { ProductoPage } from "../pages/producto.page.ts";
import { CarritoPage } from "../pages/carrito.page.ts";

// Este test puede fallar ocasionalmente por tiempos de actualización del carrito
// (el sitio usa AJAX para actualizar fragmentos del mini-cart y carrito).
// Por eso se aplica `test.describe.configure({ retries: 2 })` SOLO aquí.
test.describe.configure({ retries: 2 });

test("E2E - Seleccionar producto de Cumpleaños, agregar y luego eliminar del carrito", async ({ page }, testInfo) => {
  const home = new HomePage(page);
  const categoria = new CategoriaPage(page);
  const producto = new ProductoPage(page);
  const carrito = new CarritoPage(page);

  // Paso 1: Ir a categoría "Cumpleaños" y abrir primer producto
  await home.goto();
  await page.locator("a[href*='categoria/cumpleanos']").first().click();

  const productLinks = await categoria.selectFirstTwoProducts();
  const link = productLinks[0]; // Tomamos solo el primero

  await producto.goto(`https://www.floristeriamundoflor.com${link}`);

  // Paso 2: Agregar al carrito y verificar actualización
  const name = await producto.getName();
  const price = await producto.getPrice();
  const response = await producto.addToCart();

  expect(response).toHaveProperty("fragments");

  // Verificamos que el mini-cart/cart se haya actualizado
  const miniCartCount = page.locator(".widget_shopping_cart_content");
  await expect(miniCartCount).toContainText(name || "");

  // Paso 3: Ir al carrito
  await carrito.goto();

  // Captura ANTES de eliminar
  await testInfo.attach("carrito-antes.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  // Eliminar producto
  await page.locator(".remove").first().click();

  // Validar carrito vacío
  const emptyMsg = page.locator(".cart-empty");
  await expect(emptyMsg).toBeVisible();

  const total = page.locator(".order-total, .cart-subtotal");
  if (await total.count()) {
    const totalText = await total.first().innerText();
    expect(totalText.replace(/[^0-9]/g, "")).toBe("0");
  }

  // Captura DESPUÉS de eliminar
  await testInfo.attach("carrito-despues.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
});