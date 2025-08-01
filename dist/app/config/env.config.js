"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_EMAIL",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES",
];
const loadEnvVariable = () => {
    const config = {};
    requiredEnvVariables.forEach((key) => {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        config[key] = value;
    });
    return config;
};
exports.envVariables = loadEnvVariable();
