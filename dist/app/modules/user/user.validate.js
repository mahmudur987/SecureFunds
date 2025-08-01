"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.z
        .string({ invalid_type_error: "Email must be a string" })
        .email({ message: "Invalid email address" })
        .min(5, { message: "Name must be at least 5 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    password: zod_1.z
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
    phone: zod_1.z
        .string({ invalid_type_error: "Phone must be a string" })
        .regex(/^01[3-9]\d{8}$/, {
        message: "Phone number must be a valid 11-digit Bangladeshi number",
    })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "Address must be a string" })
        .min(5, { message: "Address must be at least 5 characters" })
        .max(100, { message: "Address cannot exceed 100 characters" })
        .optional(),
    role: zod_1.z.enum([user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN]).optional(),
    picture: zod_1.z.string().url("Invalid URL").optional(),
    isEmailVerified: zod_1.z
        .boolean({
        invalid_type_error: "isEmailVerified must be a boolean value (true or false).",
    })
        .optional(),
    isPhoneVerified: zod_1.z
        .boolean({
        invalid_type_error: "isPhoneVerified must be a boolean value (true or false).",
    })
        .optional(),
    isActive: zod_1.z
        .enum([user_interface_1.Status.ACTIVE, user_interface_1.Status.BLOCKED, user_interface_1.Status.SUSPENDED])
        .optional(),
    isDeleted: zod_1.z.boolean().optional(),
    loginAttempts: zod_1.z.number().nonnegative().optional(),
    lastLogin: zod_1.z.date().optional(),
});
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be a valid string." })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name must not exceed 50 characters." })
        .optional(),
    password: zod_1.z
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
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number must be a valid string." })
        .regex(/^01[3-9]\d{8}$/, {
        message: "Phone number must be a valid 11-digit Bangladeshi number.",
    })
        .optional(),
    isDeleted: zod_1.z
        .boolean({
        invalid_type_error: "isDeleted must be a boolean value (true or false).",
    })
        .optional(),
    isVerified: zod_1.z
        .boolean({
        invalid_type_error: "isVerified must be a boolean value (true or false).",
    })
        .optional(),
    status: zod_1.z
        .enum(Object.values(user_interface_1.Status), {
        invalid_type_error: "Status must be one of the allowed values.",
    })
        .optional(),
    role: zod_1.z
        .enum(Object.values(user_interface_1.Role), {
        invalid_type_error: "Role must be one of the allowed values.",
    })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "Address must be a valid string." })
        .min(5, { message: "Address must be at least 5 characters long." })
        .max(100, { message: "Address must not exceed 100 characters." })
        .optional(),
    picture: zod_1.z.string().url().optional(),
    isEmailVerified: zod_1.z
        .boolean({
        invalid_type_error: "isEmailVerified must be a boolean value (true or false).",
    })
        .optional(),
    isPhoneVerified: zod_1.z
        .boolean({
        invalid_type_error: "isPhoneVerified must be a boolean value (true or false).",
    })
        .optional(),
    isActive: zod_1.z
        .enum([user_interface_1.Status.ACTIVE, user_interface_1.Status.BLOCKED, user_interface_1.Status.SUSPENDED])
        .optional(),
    loginAttempts: zod_1.z
        .number({
        invalid_type_error: "loginAttempts must be a number.",
    })
        .nonnegative()
        .optional(),
    lastLogin: zod_1.z.date().optional(),
});
