import { z } from "zod";
import { CartSchema, CartsResponseSchema } from "./cart.schema";

export const AddressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  postalCode: z.string().optional(),
  coordinates: z.object({ lat: z.number().optional(), lng: z.number().optional() }).optional(),
  country: z.string().optional(),
});

export const CompanySchema = z.object({
  department: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  address: AddressSchema.optional(),
});

export const BankSchema = z.object({
  cardExpire: z.string().optional(),
  cardNumber: z.string().optional(),
  cardType: z.string().optional(),
  currency: z.string().optional(),
  iban: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  maidenName: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  birthDate: z.string().optional(),
  image: z.string().optional(),
  bloodGroup: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  eyeColor: z.string().optional(),
  ip: z.string().optional(),
  address: AddressSchema.optional(),
  macAddress: z.string().optional(),
  university: z.string().optional(),
  bank: BankSchema.optional(),
  company: CompanySchema.optional(),
  ein: z.string().optional(),
  ssn: z.string().optional(),
  role: z.string().optional(),
});

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const UserCartsResponseSchema = CartsResponseSchema;

export const AddUserRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const AddUserResponseSchema = UserSchema;

export const UpdateUserRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const UpdateUserResponseSchema = UserSchema;
