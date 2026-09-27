import { expect, test } from "../fixtures/apiFixtures";

test.describe("Cart API End-to-end", () => {
  test("List carts", async ({ cartService }) => {
    const res = await cartService.getAllCarts({ limit: 5 });
    expect(res.status).toBe(200);
    expect(res.data).toBeTruthy();
    expect(Array.isArray((res.data as any).carts)).toBe(true);
  });

  test("Get cart by id", async ({ cartService }) => {
    const list = await cartService.getAllCarts({ limit: 1 });
    expect(list.status).toBe(200);
    const first = (list.data as any).carts[0];
    expect(first).toBeTruthy();

    const single = await cartService.getCartById(first.id);
    expect(single.status).toBe(200);
    expect((single.data as any).id).toBe(first.id);
  });

  test("Get carts by user", async ({ cartService }) => {
    const list = await cartService.getAllCarts({ limit: 1 });
    expect(list.status).toBe(200);
    const first = (list.data as any).carts[0];
    expect(first).toBeTruthy();

    const byUser = await cartService.getCartsByUserId(first.userId);
    expect(byUser.status).toBe(200);
    expect(
      (byUser.data as any).carts.every((c: any) => c.userId === first.userId),
    ).toBe(true);
  });

  test("Add cart", async ({ cartService }) => {
    const addPayload = { userId: 1, products: [{ id: 1, quantity: 1 }] };
    const added = await cartService.addCart(addPayload);
    expect(added.status).toBe(201);
    expect((added.data as any).id).toBeTruthy();
  });

  test("Update cart", async ({ cartService }) => {
    const list = await cartService.getAllCarts({ limit: 1 });
    expect(list.status).toBe(200);
    const first = (list.data as any).carts[0];
    expect(first).toBeTruthy();

    const updatePayload = { merge: true, products: [{ id: 2, quantity: 1 }] };
    const updated = await cartService.updateCart(first.id, updatePayload);
    expect(updated.status).toBe(200);
  });

  test("Delete cart", async ({ cartService }) => {
    const list = await cartService.getAllCarts({ limit: 1 });
    expect(list.status).toBe(200);
    const first = (list.data as any).carts[0];
    expect(first).toBeTruthy();

    const deleted = await cartService.deleteCart(first.id);
      expect(deleted.status).toBe(200);

  });
});
