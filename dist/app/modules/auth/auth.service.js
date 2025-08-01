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
exports.authServices = exports.jwtSecrete = void 0;
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUserToken_1 = require("../../utils/createUserToken");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../../config/env.config");
const validateUserStatus_1 = require("../../middleware/validateUserStatus");
exports.jwtSecrete = "Ph-tour-Management Backend";
const credentialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ phone });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Phone not exist");
    }
    if (!password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "provide your password");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        if (Number(isUserExist.loginWrongAttempts) <= 2) {
            isUserExist.loginWrongAttempts =
                Number(isUserExist.loginWrongAttempts) + 1;
            yield isUserExist.save();
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect password");
        }
        else {
            isUserExist.status = user_interface_1.Status.SUSPENDED;
            yield isUserExist.save();
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are Suspended");
        }
    }
    const validation = (0, validateUserStatus_1.validateUserStatus)(isUserExist);
    if (!validation.isValid) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, validation.message);
    }
    const jwtPayload = {
        name: isUserExist.name,
        email: isUserExist.email,
        _id: isUserExist._id,
        phone: isUserExist.phone,
        role: isUserExist.role,
    };
    const Token = (0, createUserToken_1.createUserToken)(jwtPayload);
    isUserExist.loginAttempts = Number(isUserExist.loginAttempts) + 1;
    isUserExist.lastLogin = new Date();
    yield isUserExist.save();
    return {
        accessToken: Token.accessToken,
        refreshToken: Token.refreshToken,
        user: isUserExist,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyRefreshToken = (0, jsonwebtoken_1.verify)(refreshToken, env_config_1.envVariables.REFRESH_TOKEN_SECRET);
    console.log(verifyRefreshToken, refreshToken);
    if (!verifyRefreshToken) {
        throw new AppError_1.default(500, "Refresh token not exist");
    }
    const isUserExist = yield user_model_1.User.findOne({ email: verifyRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email not exist");
    }
    const validation = (0, validateUserStatus_1.validateUserStatus)(isUserExist);
    if (!validation.isValid) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, validation.message);
    }
    const jwtPayload = {
        name: isUserExist.name,
        email: isUserExist.email,
        _id: isUserExist._id,
        phone: isUserExist.phone,
        role: isUserExist.role,
    };
    const Token = (0, createUserToken_1.createUserToken)(jwtPayload);
    return {
        accessToken: Token.accessToken,
    };
});
exports.authServices = {
    credentialLogin,
    getNewAccessToken,
};
