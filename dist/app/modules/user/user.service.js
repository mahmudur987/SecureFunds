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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useServices = exports.createUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, password } = payload, rest = __rest(payload, ["email", "phone", "password"]);
    if (!phone || !password) {
        throw new AppError_1.default(400, "Provide your phone and password");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const alreadyPhoneExist = yield user_model_1.User.findOne({ phone }).session(session);
        if (alreadyPhoneExist)
            throw new AppError_1.default(400, "Phone already exists");
        const alreadyEmailExist = yield user_model_1.User.findOne({ email }).session(session);
        if (alreadyEmailExist)
            throw new AppError_1.default(400, "Email already exists");
        const authProvider = {
            provider: "credential",
            providerId: phone,
        };
        const sendData = Object.assign(Object.assign({}, rest), { email, lastLogin: null, phone, auths: [authProvider], password: hashedPassword });
        const user = yield user_model_1.User.create([sendData], { session });
        const walletData = {
            userId: user[0]._id,
            balance: 50,
            isBlocked: false,
        };
        const wallet = yield wallet_model_1.Wallet.create([walletData], { session });
        user[0].wallet = wallet[0]._id;
        yield user[0].save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            user: user[0],
            wallet: wallet[0],
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(400, error.message);
    }
});
exports.createUser = createUser;
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    const result = yield user_model_1.User.find(query).populate("wallet");
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found.");
    console.log(payload);
    const result = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.useServices = {
    createUser: exports.createUser,
    getAllUsers,
    updateUser,
};
