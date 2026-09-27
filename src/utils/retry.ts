import { APIResponse } from "@playwright/test";
import { Logger } from "./logger";

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  retryOnStatus?: number[];
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    retries = 3,
    delayMs = 1000,
    retryOnStatus = [429, 500, 502, 503, 504],
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const result = await operation();

      if (isApiResponse(result)) {
        const status = result.status();

        if (retryOnStatus.includes(status)) {
          throw new RetryableHttpError(result);
        }
      }

      return result;
    } catch (error) {
      lastError = error;

      if (attempt > retries) {
        Logger.error(
          `Request failed after ${attempt} attempt(s).`,
          error,
        );
        throw error;
      }

      Logger.info(
        `Attempt ${attempt} failed. Retrying in ${delayMs}ms...`,
      );

      await sleep(delayMs);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isApiResponse(value: unknown): value is APIResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "function"
  );
}

class RetryableHttpError extends Error {
  constructor(public readonly response: APIResponse) {
    super(`Retryable HTTP status: ${response.status()}`);
    this.name = "RetryableHttpError";
  }
}