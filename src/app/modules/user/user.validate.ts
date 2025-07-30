import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email address" })
    .min(5, { message: "Name must be at least 5 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit",
    })
    .regex(/[@$!%*?&#^()\-_=+{}[\]|;:'",.<>/~`]/, {
      message: "Password must contain at least one special character",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "Phone number must be a valid 11-digit Bangladeshi number",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .min(5, { message: "Address must be at least 5 characters" })
    .max(100, { message: "Address cannot exceed 100 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a valid string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .optional(),

  password: z
    .string({ invalid_type_error: "Password must be a valid string." })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must include at least one numeric digit.",
    })
    .regex(/[@$!%*?&#^()\-_=+{}[\]|;:'",.<>/~`]/, {
      message: "Password must include at least one special character.",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone number must be a valid string." })
    .regex(/^01[3-9]\d{8}$/, {
      message: "Phone number must be a valid 11-digit Bangladeshi number.",
    })
    .optional(),

  isDeleted: z
    .boolean({
      invalid_type_error: "isDeleted must be a boolean value (true or false).",
    })
    .optional(),

  isVerified: z
    .boolean({
      invalid_type_error: "isVerified must be a boolean value (true or false).",
    })
    .optional(),

  IsActive: z
    .enum(Object.values(IsActive) as [string], {
      invalid_type_error: "IsActive must be one of the allowed values.",
    })
    .optional(),

  role: z
    .enum(Object.values(Role) as [string], {
      invalid_type_error: "Role must be one of the allowed values.",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a valid string." })
    .min(5, { message: "Address must be at least 5 characters long." })
    .max(100, { message: "Address must not exceed 100 characters." })
    .optional(),
});
