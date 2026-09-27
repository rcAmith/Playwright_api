type LogLevel = "error" | "info" | "debug" | "silent";

export class Logger {
  private static level: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || "info";

  private static shouldLog(messageLevel: LogLevel): boolean {
    const order: Record<LogLevel, number> = {
      silent: 0,
      error: 1,
      info: 2,
      debug: 3,
    };

    return order[messageLevel] <= order[this.level];
  }

  static info(message: string, data?: unknown) {
    if (!this.shouldLog("info")) return;

    console.log(`\n[INFO] ${message}`);

    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  static debug(message: string, data?: unknown) {
    if (!this.shouldLog("debug")) return;

    console.log(`\n[DEBUG] ${message}`);

    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  static error(message: string, error?: unknown) {
    if (!this.shouldLog("error")) return;

    console.error(`\n[ERROR] ${message}`);

    if (error instanceof Error) {
      console.error(error.message);

      if (this.shouldLog("debug")) {
        console.error(error.stack);
      }
    } else if (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }

  static apiRequest(details: {
    method: string;
    url: string;
    headers?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: unknown;
  }) {
    if (!this.shouldLog("debug")) return;
    const safeHeaders = {
      ...details.headers,
      Authorization: details.headers?.Authorization
        ? "Bearer *****"
        : undefined,
    };
    console.log("\n=================================================");
    console.log(`🚀 ${details.method.toUpperCase()} ${details.url}`);
    console.log("=================================================");

    if (details.headers) {
      console.log("\nHeaders:");
      console.log(JSON.stringify(safeHeaders, null, 2));
    }

    if (details.query) {
      console.log("\nQuery Params:");
      console.log(JSON.stringify(details.query, null, 2));
    }

    if (details.body) {
      console.log("\nRequest Body:");
      console.log(JSON.stringify(details.body, null, 2));
    }
  }

  static apiResponse(details: {
    method: string;
    url: string;
    status: number;
    duration: number;
    body?: unknown;
  }) {
    if (!this.shouldLog("info")) return;

    console.log("\n---------------- RESPONSE ----------------");
    console.log(`${details.method.toUpperCase()} ${details.url}`);
    console.log(`Status   : ${details.status}`);
    console.log(`Duration : ${details.duration} ms`);

    if (this.shouldLog("debug") && details.body) {
      console.log("\nResponse Body:");
      console.log(JSON.stringify(details.body, null, 2));
    }

    console.log("==========================================");
  }
}
