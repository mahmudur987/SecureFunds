/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { TransactionModel } from "./transaction.model";
import { Transaction, TransactionStatus } from "./transaction.interface";
import statusCode from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHandler/AppError";
import { Wallet } from "../wallet/wallet.model";
import mongoose, { ObjectId } from "mongoose";
import { Role } from "../user/user.interface";
import {
  UserValidationResult,
  validateWalletStatus,
} from "../../middleware/validateUserStatus";
import { IWallet } from "../wallet/wallet.interface";

export const commission = 0.015;
export const transactionFee = 0.017;

const validateAndThrowIfInvalidWallet = (
  wallet: IWallet | null,
  validationFunction: (wallet: IWallet | null) => UserValidationResult
) => {
  const validationResult = validationFunction(wallet);
  if (!validationResult.isValid) {
    throw new AppError(
      validationResult.statusCode as number,
      validationResult.message as string
    );
  }
};

// user to user send money
const sendMoney = async (decodedToken: JwtPayload, data: Transaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderUser = await User.findById(decodedToken._id).session(session);
    if (!senderUser) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User not found.");
    }
    if (senderUser.role !== Role.USER) {
      throw new AppError(statusCode.BAD_REQUEST, "Only users can send money.");
    }

    const senderUserWallet = await Wallet.findOne({
      userId: decodedToken._id,
    }).session(session);
    if (!senderUserWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User Wallet not found.");
    }

    if (Number(senderUserWallet.balance) < data.amount) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }

    const receiverUser = await User.findById(data.toUserId).session(session);
    if (!receiverUser) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver User not found.");
    }
    if (receiverUser.role !== Role.USER) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "You can send money to users only."
      );
    }
    const receiverUserWallet = await Wallet.findOne({
      userId: data.toUserId,
    }).session(session);
    if (!receiverUserWallet) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "Receiver User Wallet not found."
      );
    }

    validateAndThrowIfInvalidWallet(senderUserWallet, validateWalletStatus);
    validateAndThrowIfInvalidWallet(receiverUserWallet, validateWalletStatus);

    // Update balances

    const transactionFeeAmount =
      Number(data.amount) * Number(transactionFee.toFixed(2));

    senderUserWallet.balance -= Number(data.amount) + transactionFeeAmount;
    receiverUserWallet.balance += Number(data.amount);

    await senderUserWallet.save({ session });
    await receiverUserWallet.save({ session });

    // Create transaction record
    const transactionData: Transaction = {
      transactionType: data.transactionType,
      amount: data.amount,
      transactionFeeAmount,
      commissionAmount: 0,
      finalAmount: Number(data.amount) + transactionFeeAmount,
      fromUserId: decodedToken._id,
      toUserId: data.toUserId,
      agentId: data.agentId ?? null,
      transactionStatus: TransactionStatus.success,
      description: data.description,
    };

    const result = await TransactionModel.create([transactionData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
// agent to user cashIn
const cashIn = async (decodedToken: JwtPayload, data: Transaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderUser = await User.findById(decodedToken._id).session(session);
    if (!senderUser) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User not found.");
    }
    if (senderUser.role !== Role.AGENT) {
      throw new AppError(statusCode.BAD_REQUEST, "Only agents can cash in.");
    }

    const senderUserWallet = await Wallet.findOne({
      userId: decodedToken._id,
    }).session(session);
    if (!senderUserWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User Wallet not found.");
    }

    if (Number(senderUserWallet.balance) < data.amount) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }

    const receiverUser = await User.findById(data.toUserId).session(session);
    if (!receiverUser) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver User not found.");
    }
    if (receiverUser.role !== Role.USER) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "You can send money to users only."
      );
    }
    const receiverUserWallet = await Wallet.findOne({
      userId: data.toUserId,
    }).session(session);
    if (!receiverUserWallet) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "Receiver User Wallet not found."
      );
    }
    validateAndThrowIfInvalidWallet(senderUserWallet, validateWalletStatus);
    validateAndThrowIfInvalidWallet(receiverUserWallet, validateWalletStatus);
    // Update balances

    const commissionAmount =
      Number(data.amount) * Number(commission.toFixed(2));

    senderUserWallet.balance -= Number(data.amount);
    senderUserWallet.balance += commissionAmount;
    receiverUserWallet.balance += Number(data.amount);

    await senderUserWallet.save({ session });
    await receiverUserWallet.save({ session });

    // Create transaction record
    const transactionData: Transaction = {
      transactionType: data.transactionType,
      amount: data.amount,
      transactionFeeAmount: 0,
      commissionAmount,
      finalAmount: senderUserWallet.balance,
      fromUserId: decodedToken._id,
      toUserId: data.toUserId,
      agentId: senderUser._id ?? null,
      transactionStatus: TransactionStatus.success,
      description: data.description,
    };

    const result = await TransactionModel.create([transactionData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// user to agent cashOut
const cashOut = async (decodedToken: JwtPayload, data: Transaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderUser = await User.findById(decodedToken._id).session(session);
    if (!senderUser) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User not found.");
    }
    if (senderUser.role !== Role.USER) {
      throw new AppError(statusCode.BAD_REQUEST, "Only users can cash Out.");
    }

    const senderUserWallet = await Wallet.findOne({
      userId: decodedToken._id,
    }).session(session);
    if (!senderUserWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender User Wallet not found.");
    }

    if (Number(senderUserWallet.balance) < data.amount) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }

    const receiverUser = await User.findById(data.toUserId).session(session);
    if (!receiverUser) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver User not found.");
    }
    if (receiverUser.role !== Role.AGENT) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "You can Cash out to agents only."
      );
    }
    const receiverUserWallet = await Wallet.findOne({
      userId: data.toUserId,
    }).session(session);
    if (!receiverUserWallet) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "Receiver User Wallet not found."
      );
    }
    validateAndThrowIfInvalidWallet(senderUserWallet, validateWalletStatus);
    validateAndThrowIfInvalidWallet(receiverUserWallet, validateWalletStatus);
    // Update balances
    const transactionFeeAmount =
      Number(data.amount) * Number(transactionFee.toFixed(2));
    const commissionAmount =
      Number(data.amount) * Number(commission.toFixed(2));

    senderUserWallet.balance -= Number(data.amount) + transactionFeeAmount;
    receiverUserWallet.balance += Number(data.amount) + commissionAmount;

    await senderUserWallet.save({ session });
    await receiverUserWallet.save({ session });

    // Create transaction record
    const transactionData: Transaction = {
      transactionType: data.transactionType,
      transactionFeeAmount,
      commissionAmount,
      finalAmount: Number(data.amount) + transactionFeeAmount,
      amount: data.amount,
      fromUserId: decodedToken._id,
      toUserId: data.toUserId,
      agentId: senderUser._id ?? null,
      transactionStatus: TransactionStatus.success,
      description: data.description,
    };

    const result = await TransactionModel.create([transactionData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// add -money user
const addMoney = async (decodedToken: JwtPayload, data: Transaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const receiverUser = await User.findById(decodedToken._id).session(session);
  if (!receiverUser) {
    throw new AppError(statusCode.NOT_FOUND, "Receiver User not found.");
  }
  if (receiverUser.role !== Role.USER) {
    throw new AppError(statusCode.BAD_REQUEST, "You cant add money .");
  }
  const receiverUserWallet = await Wallet.findOne({
    userId: decodedToken._id,
  }).session(session);
  if (!receiverUserWallet) {
    throw new AppError(statusCode.NOT_FOUND, "Receiver User Wallet not found.");
  }

  validateAndThrowIfInvalidWallet(receiverUserWallet, validateWalletStatus);
  receiverUserWallet.balance += Number(data.amount);

  await receiverUserWallet.save({ session });
  const transactionData: Transaction = {
    transactionType: data.transactionType,
    amount: data.amount,
    fromUserId: null,
    toUserId: decodedToken._id ?? null,
    agentId: null,
    transactionStatus: TransactionStatus.success,
    description: data.description,
  };
  const result = await TransactionModel.create([transactionData], {
    session,
  });

  await session.commitTransaction();
  session.endSession();

  return result[0];
};

const getAllTransaction = async (query: Record<string, string>) => {
  const userId = query.userId;

  const result = await TransactionModel.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }, { agentId: userId }],
  })
    .populate("fromUserId", "name email phone role")
    .populate("toUserId", "name email phone role")
    .populate("agentId", "name email phone role")
    .sort({ createdAt: -1 })
    .exec();

  return { count: result.length, data: result };
};
const getUserTransaction = async (decodedToken: JwtPayload) => {
  const userId = decodedToken._id;

  const result = await TransactionModel.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }, { agentId: userId }],
  })
    .populate("fromUserId", "name email phone role")
    .populate("toUserId", "name email phone role")
    .populate("agentId", "name email phone role")
    .sort({ createdAt: -1 })
    .exec();

  return { count: result.length, data: result };
};

export const transactionServices = {
  sendMoney,
  cashIn,
  cashOut,
  addMoney,
  getAllTransaction,
  getUserTransaction,
};
