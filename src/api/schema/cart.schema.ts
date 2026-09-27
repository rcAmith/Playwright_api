import { z } from "zod";

export const CartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number().optional(),
  discountedTotal: z.number().optional(),
  thumbnail: z.string().url().optional(),
});

export const CartSchema = z.object({
  id: z.number(),
  products: z.array(CartProductSchema),
  total: z.number(),
  discountedTotal: z.number().optional(),
  userId: z.number(),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

export const CartsResponseSchema = z.object({
  carts: z.array(CartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const AddCartRequestSchema = z.object({
  userId: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    })
  ),
});

export const AddCartResponseSchema = CartSchema;

export const UpdateCartRequestSchema = z.object({
  merge: z.boolean().optional(),
  products: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    })
  ),
});

export const UpdateCartResponseSchema = CartSchema;
