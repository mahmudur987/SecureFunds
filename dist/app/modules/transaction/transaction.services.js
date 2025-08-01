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
exports.transactionServices = exports.transactionFee = exports.commission = void 0;
const transaction_model_1 = require("./transaction.model");
const transaction_interface_1 = require("./transaction.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_interface_1 = require("../user/user.interface");
const validateUserStatus_1 = require("../../middleware/validateUserStatus");
exports.commission = 0.015;
exports.transactionFee = 0.017;
const validateAndThrowIfInvalidWallet = (wallet, validationFunction) => {
    const validationResult = validationFunction(wallet);
    if (!validationResult.isValid) {
        throw new AppError_1.default(validationResult.statusCode, validationResult.message);
    }
};
// user to user send money
const sendMoney = (decodedToken, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderUser = yield user_model_1.User.findById(decodedToken._id).session(session);
        if (!senderUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User not found.");
        }
        if (senderUser.role !== user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only users can send money.");
        }
        const senderUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: decodedToken._id,
        }).session(session);
        if (!senderUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User Wallet not found.");
        }
        if (Number(senderUserWallet.balance) < data.amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance.");
        }
        const receiverUser = yield user_model_1.User.findById(data.toUserId).session(session);
        if (!receiverUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        if (receiverUser.role !== user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can send money to users only.");
        }
        const receiverUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: data.toUserId,
        }).session(session);
        if (!receiverUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User Wallet not found.");
        }
        validateAndThrowIfInvalidWallet(senderUserWallet, validateUserStatus_1.validateWalletStatus);
        validateAndThrowIfInvalidWallet(receiverUserWallet, validateUserStatus_1.validateWalletStatus);
        // Update balances
        const transactionFeeAmount = Number(data.amount) * Number(exports.transactionFee.toFixed(2));
        senderUserWallet.balance -= Number(data.amount) + transactionFeeAmount;
        receiverUserWallet.balance += Number(data.amount);
        yield senderUserWallet.save({ session });
        yield receiverUserWallet.save({ session });
        // Create transaction record
        const transactionData = {
            transactionType: data.transactionType,
            amount: data.amount,
            transactionFeeAmount,
            commissionAmount: 0,
            finalAmount: Number(data.amount) + transactionFeeAmount,
            fromUserId: decodedToken._id,
            toUserId: data.toUserId,
            agentId: (_a = data.agentId) !== null && _a !== void 0 ? _a : null,
            transactionStatus: transaction_interface_1.TransactionStatus.success,
            description: data.description,
        };
        const result = yield transaction_model_1.TransactionModel.create([transactionData], {
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// agent to user cashIn
const cashIn = (decodedToken, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderUser = yield user_model_1.User.findById(decodedToken._id).session(session);
        if (!senderUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User not found.");
        }
        if (senderUser.role !== user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only agents can cash in.");
        }
        const senderUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: decodedToken._id,
        }).session(session);
        if (!senderUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User Wallet not found.");
        }
        if (Number(senderUserWallet.balance) < data.amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance.");
        }
        const receiverUser = yield user_model_1.User.findById(data.toUserId).session(session);
        if (!receiverUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        if (receiverUser.role !== user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can send money to users only.");
        }
        const receiverUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: data.toUserId,
        }).session(session);
        if (!receiverUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User Wallet not found.");
        }
        validateAndThrowIfInvalidWallet(senderUserWallet, validateUserStatus_1.validateWalletStatus);
        validateAndThrowIfInvalidWallet(receiverUserWallet, validateUserStatus_1.validateWalletStatus);
        // Update balances
        const commissionAmount = Number(data.amount) * Number(exports.commission.toFixed(2));
        senderUserWallet.balance -= Number(data.amount);
        senderUserWallet.balance += commissionAmount;
        receiverUserWallet.balance += Number(data.amount);
        yield senderUserWallet.save({ session });
        yield receiverUserWallet.save({ session });
        // Create transaction record
        const transactionData = {
            transactionType: data.transactionType,
            amount: data.amount,
            transactionFeeAmount: 0,
            commissionAmount,
            finalAmount: senderUserWallet.balance,
            fromUserId: decodedToken._id,
            toUserId: data.toUserId,
            agentId: (_a = senderUser._id) !== null && _a !== void 0 ? _a : null,
            transactionStatus: transaction_interface_1.TransactionStatus.success,
            description: data.description,
        };
        const result = yield transaction_model_1.TransactionModel.create([transactionData], {
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// user to agent cashOut
const cashOut = (decodedToken, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderUser = yield user_model_1.User.findById(decodedToken._id).session(session);
        if (!senderUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User not found.");
        }
        if (senderUser.role !== user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only users can cash Out.");
        }
        const senderUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: decodedToken._id,
        }).session(session);
        if (!senderUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender User Wallet not found.");
        }
        if (Number(senderUserWallet.balance) < data.amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance.");
        }
        const receiverUser = yield user_model_1.User.findById(data.toUserId).session(session);
        if (!receiverUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        if (receiverUser.role !== user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can Cash out to agents only.");
        }
        const receiverUserWallet = yield wallet_model_1.Wallet.findOne({
            userId: data.toUserId,
        }).session(session);
        if (!receiverUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User Wallet not found.");
        }
        validateAndThrowIfInvalidWallet(senderUserWallet, validateUserStatus_1.validateWalletStatus);
        validateAndThrowIfInvalidWallet(receiverUserWallet, validateUserStatus_1.validateWalletStatus);
        // Update balances
        const transactionFeeAmount = Number(data.amount) * Number(exports.transactionFee.toFixed(2));
        const commissionAmount = Number(data.amount) * Number(exports.commission.toFixed(2));
        senderUserWallet.balance -= Number(data.amount) + transactionFeeAmount;
        receiverUserWallet.balance += Number(data.amount) + commissionAmount;
        yield senderUserWallet.save({ session });
        yield receiverUserWallet.save({ session });
        // Create transaction record
        const transactionData = {
            transactionType: data.transactionType,
            transactionFeeAmount,
            commissionAmount,
            finalAmount: Number(data.amount) + transactionFeeAmount,
            amount: data.amount,
            fromUserId: decodedToken._id,
            toUserId: data.toUserId,
            agentId: (_a = senderUser._id) !== null && _a !== void 0 ? _a : null,
            transactionStatus: transaction_interface_1.TransactionStatus.success,
            description: data.description,
        };
        const result = yield transaction_model_1.TransactionModel.create([transactionData], {
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// add -money user
const addMoney = (decodedToken, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const receiverUser = yield user_model_1.User.findById(decodedToken._id).session(session);
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
    }
    if (receiverUser.role !== user_interface_1.Role.USER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cant add money .");
    }
    const receiverUserWallet = yield wallet_model_1.Wallet.findOne({
        userId: decodedToken._id,
    }).session(session);
    if (!receiverUserWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver User Wallet not found.");
    }
    validateAndThrowIfInvalidWallet(receiverUserWallet, validateUserStatus_1.validateWalletStatus);
    receiverUserWallet.balance += Number(data.amount);
    yield receiverUserWallet.save({ session });
    const transactionData = {
        transactionType: data.transactionType,
        amount: data.amount,
        fromUserId: null,
        toUserId: (_a = decodedToken._id) !== null && _a !== void 0 ? _a : null,
        agentId: null,
        transactionStatus: transaction_interface_1.TransactionStatus.success,
        description: data.description,
    };
    const result = yield transaction_model_1.TransactionModel.create([transactionData], {
        session,
    });
    yield session.commitTransaction();
    session.endSession();
    return result[0];
});
const getAllTransaction = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = query.userId;
    const result = yield transaction_model_1.TransactionModel.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }, { agentId: userId }],
    })
        .populate("fromUserId", "name email phone role")
        .populate("toUserId", "name email phone role")
        .populate("agentId", "name email phone role")
        .sort({ createdAt: -1 })
        .exec();
    return { count: result.length, data: result };
});
const getUserTransaction = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken._id;
    const result = yield transaction_model_1.TransactionModel.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }, { agentId: userId }],
    })
        .populate("fromUserId", "name email phone role")
        .populate("toUserId", "name email phone role")
        .populate("agentId", "name email phone role")
        .sort({ createdAt: -1 })
        .exec();
    return { count: result.length, data: result };
});
exports.transactionServices = {
    sendMoney,
    cashIn,
    cashOut,
    addMoney,
    getAllTransaction,
    getUserTransaction,
};
