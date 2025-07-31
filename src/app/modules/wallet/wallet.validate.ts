import z from "zod";
import { WalletStatus } from "./wallet.interface";

export const createWalletZodSchema = z.object({
  userId: z
    .string({ invalid_type_error: "userId must be a valid uuid string" })
    .uuid({ message: "userId must be a valid uuid string" }),
  balance: z
    .number({ invalid_type_error: "balance must be a number" })
    .nonnegative({ message: "balance must be a non-negative number" }),
});

export const updateWalletZodSchema = z.object({
  balance: z
    .number({ invalid_type_error: "balance must be a number" })
    .nonnegative({ message: "balance must be a non-negative number" })
    .optional(),
  status: z
    .enum(Object.values(WalletStatus) as [string, ...string[]], {
      invalid_type_error: "status must be one of the allowed values.",
    })
    .optional(),
});
