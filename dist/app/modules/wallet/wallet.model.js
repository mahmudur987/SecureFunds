"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.walletSchema = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
exports.walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, require: true, default: 0 },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletStatus),
        default: wallet_interface_1.WalletStatus.PENDING,
    },
}, { versionKey: false, timestamps: true });
exports.Wallet = (0, mongoose_1.model)("Wallet", exports.walletSchema);
