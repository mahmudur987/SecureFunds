import { z } from "zod";

export const transactionValidationSchema = z.object({
  transactionType: z.enum(["Send-Money", "CashIn", "CashOut", "Add-Money"], {
    invalid_type_error: "Transaction type must be one of the allowed values.",
  }),

  amount: z
    .number({ invalid_type_error: "Amount must be a valid number." })
    .positive({ message: "Amount must be a positive number." }),

  fromUserId: z
    .string({ invalid_type_error: "From User ID must be a valid string." })
    .nonempty({ message: "From User ID is required." })
    .optional(),

  toUserPhone: z
    .string({ invalid_type_error: "To User ID must be a valid string." })
    .nonempty({ message: "To User ID is required." })
    .optional(),

  agentId: z
    .string({ invalid_type_error: "Agent ID must be a valid string." })
    .nonempty({ message: "Agent ID is required." })
    .optional(),

  transactionStatus: z
    .enum(["success", "pending", "failed"], {
      invalid_type_error:
        "Transaction status must be one of the allowed values.",
    })
    .optional(),

  description: z
    .string({ invalid_type_error: "Description must be a valid string." })
    .optional(),
});
