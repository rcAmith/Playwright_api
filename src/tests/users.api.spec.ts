import { expect, test } from "../fixtures/apiFixtures";

test.describe("Users API End-to-end", () => {
  test("List users (limit=5)", async ({ userService }) => {
    const res = await userService.getAllUsers({ limit: 5 });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.data).toBeTruthy();
    expect(Array.isArray((res.data as any).users)).toBe(true);
  });

  test("Get user by id ", async ({ userService }) => {
    const list = await userService.getAllUsers({ limit: 1 });
    expect(list.status).toBeGreaterThanOrEqual(200);
    expect(list.status).toBeLessThan(300);
    const first = (list.data as any).users[0];
    expect(first).toBeTruthy();

    const single = await userService.getUserById(first.id);
    expect(single.status).toBeGreaterThanOrEqual(200);
    expect(single.status).toBeLessThan(300);
    expect((single.data as any).id).toBe(first.id);
  });

  test("Get user's carts by id ", async ({
    userService,
  }) => {
    const list = await userService.getAllUsers({ limit: 1 });
    expect(list.status).toBeGreaterThanOrEqual(200);
    expect(list.status).toBeLessThan(300);
    const first = (list.data as any).users[0];
    expect(first).toBeTruthy();

    const carts = await userService.getUserCarts(first.id);
    expect(carts.status).toBeGreaterThanOrEqual(200);
    expect(carts.status).toBeLessThan(300);
    expect(Array.isArray((carts.data as any).carts)).toBe(true);
  });

  test("Add user (simulated)", async ({ userService }) => {
    const payload = { firstName: "Muhammad", lastName: "Ovi", age: 250 };
    const added = await userService.addUser(payload);
    expect(added.status).toBeGreaterThanOrEqual(200);
    expect(added.status).toBeLessThan(300);
    expect((added.data as any).id).toBeTruthy();
  });

  test("Update user", async ({ userService }) => {
    const list = await userService.getAllUsers({ limit: 1 });
    expect(list.status).toBeGreaterThanOrEqual(200);
    expect(list.status).toBeLessThan(300);
    const first = (list.data as any).users[0];
    expect(first).toBeTruthy();

    const payload = { lastName: "Updated" };
    const updated = await userService.updateUser(first.id, payload);
    expect((updated.data as any).id).toBe(first.id);
  });

  test("Delete user (may return 404 for simulated API)", async ({
    userService,
  }) => {
    const list = await userService.getAllUsers({ limit: 1 });
    expect(list.status).toBeGreaterThanOrEqual(200);
    expect(list.status).toBeLessThan(300);
    const first = (list.data as any).users[0];
    expect(first).toBeTruthy();

    const deleted = await userService.deleteUser(first.id);
    const d = deleted.data as any;
    expect(d).toBeTruthy();
  });
});
