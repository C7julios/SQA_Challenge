import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { CategoriaPage } from "../pages/categoria.page";
import { ProductoPage } from "../pages/producto.page";
import { CarritoPage } from "../pages/carrito.page";


test("E2E - Seleccionar 2 productos de Amor y agregarlos al carrito", async ({ page }) => {
  const home = new HomePage(page);
  const categoria = new CategoriaPage(page);
  const producto = new ProductoPage(page);
  const carrito = new CarritoPage(page);

  await home.goto();
  await home.goToAmorCategory();

  const productLinks = await categoria.selectFirstTwoProducts();
  const addedProducts: { name: string | null; price: string }[] = [];

  for (const link of productLinks) {
    await producto.goto(`https://www.floristeriamundoflor.com${link}`);
    const name = await producto.getName();
    const price = await producto.getPrice();
    const response = await producto.addToCart();

    expect(response).toHaveProperty("fragments");
    addedProducts.push({ name, price });
  }

  await carrito.goto();
  await carrito.validateCart(addedProducts);
});