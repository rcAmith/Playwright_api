import { test as base } from "@playwright/test";
import { ApiClient } from "../api/client/apiClient";
import { AuthService } from "../api/services/auth/authService";
import { TokenManager } from "../api/services/auth/tokenManager";
import { ProductService } from "../api/services/products/ProductService";
import { UserService } from "../api/services/users/UserService";
import { CartService } from "../api/services/cart/CartService";

type ApiFixtures = {
  apiClient: ApiClient;
  authService: AuthService;
  productService: ProductService;
  cartService: CartService;
  userService: UserService;
  tokenManager: TokenManager;
  loggedIn: void;
};

export const test = base.extend<ApiFixtures>({
  tokenManager: async ({}, use) => {
    const manager = new TokenManager();
    await use(manager);
  },

  apiClient: async ({ request, tokenManager }, use) => {
    const client = new ApiClient(
      request,
      tokenManager,
      process.env.API_BASE_URL!,
    );

    await use(client);
  },

  authService: async ({ apiClient }, use) => {
    const auth = new AuthService(apiClient);
    await use(auth);
  },

  productService: async ({ apiClient }, use) => {
    const service = new ProductService(apiClient);
    await use(service);
  },

  userService: async ({ apiClient }, use) => {
    const service = new UserService(apiClient);
    await use(service);
  },

  cartService: async ({ apiClient }, use) => {
    const service = new CartService(apiClient);
    await use(service);
  },

  loggedIn: async ({ authService, tokenManager }, use) => {
    const login = await authService.login({
      username: process.env.API_USERNAME!,
      password: process.env.API_PASSWORD!,
      expiresInMins: 30,
    });
    tokenManager.setSession({
      accessToken: login.data.accessToken,
      refreshToken: login.data.refreshToken,
    });

    await use();
  },
});

export { expect } from "@playwright/test";
