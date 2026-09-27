import { ApiClient } from "../../client/apiClient";
import {
  CartSchema,
  CartsResponseSchema,
  AddCartRequestSchema,
  AddCartResponseSchema,
  UpdateCartRequestSchema,
  UpdateCartResponseSchema,
} from "../../schema/cart.schema";
import { validateSchema } from "../../schema/validate.schema";

export class CartService {
  constructor(private apiClient: ApiClient) {}

  async getAllCarts(query?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    let path = "/carts";
    if (query) {
      const params = new URLSearchParams();
      if (typeof query.limit === "number") params.append("limit", String(query.limit));
      if (typeof query.skip === "number") params.append("skip", String(query.skip));
      if (query.select) params.append("select", query.select);
      if (query.sortBy) params.append("sortBy", query.sortBy);
      if (query.order) params.append("order", query.order);
      const qs = params.toString();
      if (qs) path = `${path}?${qs}`;
    }

    const res = await this.apiClient.get(path);

    return {
      status: res.status,
      data: validateSchema(CartsResponseSchema, res.body),
    };
  }

  async getCartById(id: number) {
    const res = await this.apiClient.get(`/carts/${id}`);

    return {
      status: res.status,
      data: validateSchema(CartSchema, res.body),
    };
  }

  async getCartsByUserId(userId: number) {
    const res = await this.apiClient.get(`/carts/user/${userId}`);

    return {
      status: res.status,
      data: validateSchema(CartsResponseSchema, res.body),
    };
  }

  async addCart(cartData: any) {
    try {
      validateSchema(AddCartRequestSchema, cartData);
    } catch (err) {
      throw err;
    }

    const res = await this.apiClient.post("/carts/add", cartData);

    return {
      status: res.status,
      data: validateSchema(AddCartResponseSchema, res.body),
    };
  }

  async updateCart(id: number, cartData: any) {
    try {
      validateSchema(UpdateCartRequestSchema, cartData);
    } catch (err) {
      throw err;
    }

    const res = await this.apiClient.put(`/carts/${id}`, cartData);
    // if (res.status >= 200 && res.status < 300) {
      return {
        status: res.status,
        data: validateSchema(UpdateCartResponseSchema, res.body),
      };
    // }

    // return {
    //   status: res.status,
    //   data: res.body,
    // };
  }

  async deleteCart(id: number) {
    const res = await this.apiClient.delete(`/carts/${id}`);

    let data: any;
    try {
      data = validateSchema(CartSchema, res.body);
    } catch (err) {
      data = res.body;
    }

    return {
      status: res.status,
      data,
    };
  }
}
