import { expect, test } from "../fixtures/apiFixtures";

test.describe("Login API Tests", () => {
  test("login with valid credentials", async ({ authService }) => {
    const res = await authService.login({
      username: process.env.API_USERNAME!,
      password: process.env.API_PASSWORD!,
      expiresInMins: 30,
    });

    expect(res.status).toBe(200);
    expect(res.data.accessToken).toBeTruthy();
  });
});
