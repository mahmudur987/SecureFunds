/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHandler/AppError";
import statusCode from "http-status-codes";
import { IAuthProvider, IUSER } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import BuildQuery from "../../utils/QueryBuilder";

export const createUser = async (payload: IUSER) => {
  const { email, phone, password, ...rest } = payload;

  if (!phone || !password) {
    throw new AppError(400, "Provide your phone and password");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const alreadyPhoneExist = await User.findOne({ phone }).session(session);
    if (alreadyPhoneExist) throw new AppError(400, "Phone already exists");

    const alreadyEmailExist = await User.findOne({ email }).session(session);
    if (alreadyEmailExist) throw new AppError(400, "Email already exists");

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: phone,
    };

    const sendData = {
      ...rest,
      email,
      lastLogin: null,
      phone,
      auths: [authProvider],
      password: hashedPassword,
    };

    const user = await User.create([sendData], { session });
    const walletData = {
      userId: user[0]._id,
      balance: 50,
      isBlocked: false,
    };

    const wallet = await Wallet.create([walletData], { session });
    user[0].wallet = wallet[0]._id;
    await user[0].save({ session });
    await session.commitTransaction();
    session.endSession();
    return {
      user: user[0],
      wallet: wallet[0],
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, error.message);
  }
};

const getAllUsers = async (query: Record<string, string> = {}) => {
  const { data, meta } = await BuildQuery(User.find(), query, {
    searchFields: ["name", "description"],
  });

  return {
    data,
    meta,
  };
};
const getSingleUser = async (decodedToken: JwtPayload) => {
  const result = await User.findById(decodedToken._id)
    .lean()
    .populate("wallet");
  return result;
};

const updateUser = async (userId: string, payload: Partial<IUSER>) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) throw new AppError(statusCode.NOT_FOUND, "User not found.");
  console.log(payload);
  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const useServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
