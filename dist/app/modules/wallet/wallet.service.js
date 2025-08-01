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
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = void 0;
const wallet_model_1 = require("./wallet.model");
const getAllWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.find({}).populate("userId", "name email phone role");
    return { count: wallet.length, data: wallet };
});
const updateWallet = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_model_1.Wallet.findOneAndUpdate({ userId }, data, {
        new: true,
    });
    return result;
});
exports.walletService = { getAllWallet, updateWallet };
