"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidationSchema = void 0;
const zod_1 = require("zod");
exports.transactionValidationSchema = zod_1.z.object({
    transactionType: zod_1.z.enum(["Send-Money", "CashIn", "CashOut", "Add-Money"], {
        invalid_type_error: "Transaction type must be one of the allowed values.",
    }),
    amount: zod_1.z
        .number({ invalid_type_error: "Amount must be a valid number." })
        .positive({ message: "Amount must be a positive number." }),
    fromUserId: zod_1.z
        .string({ invalid_type_error: "From User ID must be a valid string." })
        .nonempty({ message: "From User ID is required." })
        .optional(),
    toUserId: zod_1.z
        .string({ invalid_type_error: "To User ID must be a valid string." })
        .nonempty({ message: "To User ID is required." })
        .optional(),
    agentId: zod_1.z
        .string({ invalid_type_error: "Agent ID must be a valid string." })
        .nonempty({ message: "Agent ID is required." })
        .optional(),
    transactionStatus: zod_1.z
        .enum(["success", "pending", "failed"], {
        invalid_type_error: "Transaction status must be one of the allowed values.",
    })
        .optional(),
    description: zod_1.z
        .string({ invalid_type_error: "Description must be a valid string." })
        .optional(),
});
