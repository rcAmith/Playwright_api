import { z } from "zod";
import { Logger } from "../../utils/logger";

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    Logger.error("Schema validation failed", err);
    throw err;
  }
}