"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.transactionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_interface_1 = require("./transaction.interface");
exports.transactionSchema = new mongoose_1.default.Schema({
    transactionType: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    amount: { type: Number, required: true },
    transactionFeeAmount: { type: Number },
    commissionAmount: { type: Number },
    finalAmount: { type: Number },
    fromUserId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    toUserId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    agentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    transactionStatus: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionStatus),
        default: transaction_interface_1.TransactionStatus.pending,
    },
    description: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});
exports.TransactionModel = mongoose_1.default.model("Transaction", exports.transactionSchema);
