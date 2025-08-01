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
exports.seedAdmin = void 0;
/* eslint-disable no-console */
const env_config_1 = require("../config/env.config");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isAdminExist = yield user_model_1.User.findOne({
        email: env_config_1.envVariables.SUPER_ADMIN_EMAIL,
    });
    if (isAdminExist) {
        console.log("Admin Exist");
        return;
    }
    const hashPass = yield bcryptjs_1.default.hash(env_config_1.envVariables.SUPER_ADMIN_PASSWORD, 10);
    try {
        const Admin = {
            name: " Admin",
            email: env_config_1.envVariables.SUPER_ADMIN_EMAIL,
            password: hashPass,
            isEmailVerified: true,
            isPhoneVerified: true,
            phone: "01671706882",
            status: user_interface_1.Status.ACTIVE,
            role: user_interface_1.Role.ADMIN,
            auths: [
                { provider: "credential", providerId: env_config_1.envVariables.SUPER_ADMIN_EMAIL },
            ],
        };
        const admin = yield user_model_1.User.create(Admin);
        const walletData = {
            userId: admin._id,
            balance: 500000000000,
            isBlocked: false,
        };
        const wallet = yield wallet_model_1.Wallet.create(walletData);
        admin.wallet = wallet._id;
        yield admin.save();
        console.log(" admin created");
    }
    catch (error) {
        console.error(error);
    }
});
exports.seedAdmin = seedAdmin;
