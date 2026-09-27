import { ApiClient } from "../../client/apiClient";
import { LoginResponseSchema , LoginRequest, LoginRequestSchema } from "../../schema/auth.schema";
import { validateSchema } from "../../schema/validate.schema";

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  async login(request: LoginRequest) {
    const payload = validateSchema(LoginRequestSchema, request);

    const res = await this.apiClient.post("/auth/login", payload);

    return {
      status: res.status,
      data: validateSchema(LoginResponseSchema, res.body),
    };
  }
}
