import { APIRequestContext } from "@playwright/test";
import { Logger } from "../../utils/logger";
import { retry } from "../../utils/retry";
import { TokenManager } from "../services/auth/tokenManager";

type HttpMethod = "get" | "post" | "put" | "delete";

export interface ApiResponse {
  status: number;
  responseCode?: number;
  message?: string;
  [key: string]: any;
}

export interface ApiRequestOptions {
  headers?: Record<string, any>;
  timeout?: number;
}

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private tokenManager: TokenManager,
    private baseURL: string,
  ) {}

  private async send(
    method: HttpMethod,
    endpoint: string,
    payload?: Record<string, any>,
    options?: ApiRequestOptions,
  ) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.tokenManager.getAccessToken();

    const start = Date.now();

    Logger.apiRequest({
      method,
      url: `${process.env.API_BASE_URL}${endpoint}`,
      query: method === "get" ? payload : undefined,
      body: method !== "get" ? payload : undefined,
      headers: options?.headers,
    });

    const response = await retry(
      () =>
        this.request[method](url, {
          params: method === "get" ? payload : undefined,

          data: method !== "get" ? payload : undefined,

          timeout: options?.timeout ?? 30000,

          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      {
        retries: 3,
        delayMs: 1000,
      },
    );
    const duration = Date.now() - start;

    // if (!response.ok()) {
    //   Logger.error("API Request Failed", {
    //     method,
    //     url,
    //     status: response.status(),
    //     payload,
    //   });
    // }
    let responseData: any;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    Logger.apiResponse({
      method,
      url: `${process.env.API_BASE_URL}${endpoint}`,
      status: response.status(),
      duration,
      body: responseData,
    });

    return {
      status: response.status(),
      body: responseData,
    };
  }

  get(
    endpoint: string,
    params?: Record<string, any>,
    options?: ApiRequestOptions,
  ) {
    return this.send("get", endpoint, params, options);
  }

  post(
    endpoint: string,
    payload?: Record<string, any>,
    options?: ApiRequestOptions,
  ) {
    return this.send("post", endpoint, payload, options);
  }

  put(
    endpoint: string,
    payload?: Record<string, any>,
    options?: ApiRequestOptions,
  ) {
    return this.send("put", endpoint, payload, options);
  }

  delete(
    endpoint: string,
    payload?: Record<string, any>,
    options?: ApiRequestOptions,
  ) {
    return this.send("delete", endpoint, payload, options);
  }
}
