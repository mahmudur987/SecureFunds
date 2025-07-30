import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
import statusCode from "http-status-codes";
import { IAuthProvider, IUSER, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../wallet/wallet.model";
export const createUser = async (
  payload: IUSER,
  session: mongoose.ClientSession
) => {
  const { email, phone, password, ...rest } = payload;
  console.log(phone);
  if (!phone || !password) {
    throw new AppError(400, "Provide your phone and password");
  }

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
  user[0].save();
  return {
    user: user[0],
    wallet: wallet[0],
  };
};

const getAllUsers = async () => {
  const result = await User.find({}).populate("wallet");
  return result;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUSER>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  console.log(
    (isUserExist?.email !== decodedToken.email &&
      decodedToken.role !== Role.ADMIN) ||
      Role.SUPER_ADMIN
  );
  if (
    isUserExist?.email !== decodedToken.email &&
    (decodedToken.role !== Role.ADMIN || Role.SUPER_ADMIN)
  ) {
    throw new AppError(statusCode.FORBIDDEN, "Ypu have no access for doing it");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(statusCode.FORBIDDEN, "no access");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        statusCode.FORBIDDEN,
        "Only Super Admin can Make Super Admin"
      );
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(statusCode.FORBIDDEN, "no access");
    }
  }

  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const useServices = {
  createUser,
  getAllUsers,
  updateUser,
};
