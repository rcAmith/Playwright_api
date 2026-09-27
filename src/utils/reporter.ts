import { test } from "@playwright/test";

export class Reporter {
  static async attachJson(name: string, data: unknown) {
    await test.info().attach(name, {
      body: JSON.stringify(data, null, 2),
      contentType: "application/json",
    });
  }

  static async attachText(name: string, text: string) {
    await test.info().attach(name, {
      body: text,
      contentType: "text/plain",
    });
  }
}