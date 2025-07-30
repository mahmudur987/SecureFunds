import z from "zod";

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
  isBlocked: z
    .boolean({ invalid_type_error: "isBlocked must be a boolean" })
    .optional(),
});
