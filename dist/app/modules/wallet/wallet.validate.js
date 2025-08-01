"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const wallet_interface_1 = require("./wallet.interface");
exports.createWalletZodSchema = zod_1.default.object({
    userId: zod_1.default
        .string({ invalid_type_error: "userId must be a valid uuid string" })
        .uuid({ message: "userId must be a valid uuid string" }),
    balance: zod_1.default
        .number({ invalid_type_error: "balance must be a number" })
        .nonnegative({ message: "balance must be a non-negative number" }),
});
exports.updateWalletZodSchema = zod_1.default.object({
    balance: zod_1.default
        .number({ invalid_type_error: "balance must be a number" })
        .nonnegative({ message: "balance must be a non-negative number" })
        .optional(),
    status: zod_1.default
        .enum(Object.values(wallet_interface_1.WalletStatus), {
        invalid_type_error: "status must be one of the allowed values.",
    })
        .optional(),
});
