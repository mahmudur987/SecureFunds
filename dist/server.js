"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./app/config/env.config");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const port = 5000;
const uri = env_config_1.envVariables.DB_URL;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(uri);
        console.log("connected to mongodb");
    }
    catch (error) {
        console.error("Not connect  to Mongodb", error);
    }
});
(() => {
    (0, seedSuperAdmin_1.seedAdmin)();
    startServer();
})();
const server = app_1.default.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected ...server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected ....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("Sigterm single detected ....server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT single detected ....server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// unhandled Rejection error
// Promise.reject(new Error("I forget to catch this error"));
// uncaughtException error
// throw new Error("I forget to handle local error");
