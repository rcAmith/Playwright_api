import { ApiClient } from "../../client/apiClient";
import {
  ProductSchema,
  ProductsResponseSchema,
  SelectedProductsResponseSchema,
} from "../../schema/product.schema";
import { validateSchema } from "../../schema/validate.schema";

export class ProductService {
  constructor(private apiClient: ApiClient) {}

  async getProducts() {
    const res = await this.apiClient.get("/products");

    return {
      status: res.status,
      data: validateSchema(ProductsResponseSchema, res.body),
    };
  }

  async getProductById(id: number) {
    const res = await this.apiClient.get(`/products/${id}`);

    return {
      status: res.status,
      data: validateSchema(ProductSchema, res.body),
    };
  }

  async searchProducts(query: string) {
    const res = await this.apiClient.get(`/products/search?q=${query}`);
    return {
      status: res.status,
      data: validateSchema(ProductsResponseSchema, res.body),
    };
  }
  async limitSkipAndSelectProducts(
    limit: number,
    skip: number,
    select: string[],
  ) {
    const res = await this.apiClient.get("/products", {
      limit,
      skip,
    });
    return {
      status: res.status,
      data: validateSchema(SelectedProductsResponseSchema, res.body),
    };
  }
  async sortProducts(sortBy: string, order: "asc" | "desc") {
    const res = await this.apiClient.get("/products", {
      sortBy,
      order,
    });
    return {
      status: res.status,
      data: validateSchema(ProductsResponseSchema, res.body),
    };
  }
  async getAllProductCategories() {
    const res = await this.apiClient.get("/products/categories");
    return {
      status: res.status,
      data: res.body,
    };
  }
  async getProductsCategorylist() {
    const res = await this.apiClient.get("/products/category-list");
    return {
      status: res.status,
      data: res.body,
    };
  }
  async getProductsByCategory(category: string) {
    const res = await this.apiClient.get(`/products/category/${category}`);
    return {
      status: res.status,
      data: validateSchema(ProductsResponseSchema, res.body),
    };
  }
  async addProduct(payload: Record<string, any>) {
    const res = await this.apiClient.post("/products/add", payload);

    return {
      status: res.status,
      data: res.body,
    };
  }
  async updateProduct(id: number, payload: Record<string, any>) {
    const res = await this.apiClient.put(`/products/${id}`, payload);
    return {
      status: res.status,
      data: res.body,
    };
  }
  async deleteProduct(id: number) {
    const res = await this.apiClient.delete(`/products/${id}`);
    return {
      status: res.status,
      data: res.body,
    };
  }
}
