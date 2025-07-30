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

    // Update balances
    senderUserWallet.balance -= Number(data.amount);
    receiverUserWallet.balance += Number(data.amount);

    await senderUserWallet.save({ session });
    await receiverUserWallet.save({ session });

    // Create transaction record
    const transactionData: Transaction = {
      transactionType: data.transactionType,
      amount: data.amount,
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

    // Update balances
    senderUserWallet.balance -= Number(data.amount);
    receiverUserWallet.balance += Number(data.amount);

    await senderUserWallet.save({ session });
    await receiverUserWallet.save({ session });

    // Create transaction record
    const transactionData: Transaction = {
      transactionType: data.transactionType,
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
export const transactionServices = {
  sendMoney,
  cashIn,
};
