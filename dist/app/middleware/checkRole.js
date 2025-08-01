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
exports.CheckRole = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHandler/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../modules/auth/auth.service");
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../modules/user/user.model");
const validateUserStatus_1 = require("./validateUserStatus");
const CheckRole = (...authRole) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthenticated user");
        }
        const tokenVerify = jsonwebtoken_1.default.verify(token, auth_service_1.jwtSecrete);
        if (!tokenVerify) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Admin verification failed for token");
        }
        const isUserExist = yield user_model_1.User.findOne({ email: tokenVerify.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_2.default.BAD_REQUEST, "Email not exist");
        }
        const validation = (0, validateUserStatus_1.validateUserStatus)(isUserExist);
        if (!validation.isValid) {
            throw new AppError_1.default(validation.statusCode, validation.message);
        }
        if (!authRole.includes(tokenVerify.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Unauthenticated user");
        }
        req.user = tokenVerify;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.CheckRole = CheckRole;
