import { expect, test } from "../fixtures/apiFixtures";

test.describe("Product API Tests", () => {
  test("get all products", async ({ productService }) => {
    const res = await productService.getProducts();
    expect(res.status).toBe(200);
  });
  test("get product by ID", async ({productService }) => {
    const res = await productService.getProductById(1);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("id", 1);
  });
  test("search products", async ({ productService }) => {
    const res = await productService.searchProducts("phone");
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("products");
  });
  test("limit, skip and select products", async ({ productService }) => {
    const res = await productService.limitSkipAndSelectProducts(5, 0, [
      "title",
      "price",
    ]);
    expect(res.status).toBe(200);
    expect(res.data.products.length).toBeLessThanOrEqual(5);
  });
  test("sort products", async ({ productService }) => {
    const res = await productService.sortProducts("price", "asc");
    expect(res.status).toBe(200);
    expect(res.data.products[0].price).toBeLessThanOrEqual(
      res.data.products[1].price,
    );
  });
  test("get all product categories", async ({ productService }) => {
    const res = await productService.getAllProductCategories();
    expect(res.status).toBe(200);
    expect(res.data).toBeInstanceOf(Array);
  });
  test("get products category list", async ({ productService }) => {
    const res = await productService.getProductsCategorylist();
    expect(res.status).toBe(200);
    expect(res.data).toBeInstanceOf(Array);
  });
  test("getproduct by category", async ({ productService }) => {
    const res = await productService.getProductsByCategory("smartphones");
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("products");
  });
  test("add new product", async ({ productService }) => {
    const res = await productService.addProduct({
      title: "Test Product",
      price: 100,
      description: "Test product description",
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
  });
  test("update product", async ({ productService }) => {
    const res = await productService.updateProduct(1, {
      title: "Updated Product",
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("title", "Updated Product");
  });
  test("delete product", async ({ productService }) => {
    const res = await productService.deleteProduct(1);
    expect(res.status).toBe(200);
  });
});
