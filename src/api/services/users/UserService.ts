import { ApiClient } from "../../client/apiClient";
import {
  UsersResponseSchema,
  UserSchema,
  UserCartsResponseSchema,
  AddUserRequestSchema,
  AddUserResponseSchema,
  UpdateUserRequestSchema,
  UpdateUserResponseSchema,
} from "../../schema/user.schema";
import { validateSchema } from "../../schema/validate.schema";

export class UserService {
  constructor(private apiClient: ApiClient) {}

  async getAllUsers(query?: { limit?: number; skip?: number; select?: string; sortBy?: string; order?: 'asc' | 'desc' }) {
    let path = "/users";
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
    return { status: res.status, data: validateSchema(UsersResponseSchema, res.body) };
  }

  async getUserById(id: number) {
    const res = await this.apiClient.get(`/users/${id}`);
    return { status: res.status, data: validateSchema(UserSchema, res.body) };
  }

  async getUserCarts(id: number) {
    const res = await this.apiClient.get(`/users/${id}/carts`);
    return { status: res.status, data: validateSchema(UserCartsResponseSchema, res.body) };
  }

  async addUser(payload: any) {
    validateSchema(AddUserRequestSchema, payload);
    const res = await this.apiClient.post(`/users/add`, payload);
    return { status: res.status, data: res.body };
  }

  async updateUser(id: number, payload: any) {
    validateSchema(UpdateUserRequestSchema, payload);
    const res = await this.apiClient.put(`/users/${id}`, payload);
    if (res.status >= 200 && res.status < 300) {
      return { status: res.status, data: validateSchema(UpdateUserResponseSchema, res.body) };
    }
    return { status: res.status, data: res.body };
  }

  async deleteUser(id: number) {
    const res = await this.apiClient.delete(`/users/${id}`);
    if (res.status >= 200 && res.status < 300) {
      return { status: res.status, data: validateSchema(UserSchema, res.body) };
    }
    return { status: res.status, data: res.body };
  }
}
