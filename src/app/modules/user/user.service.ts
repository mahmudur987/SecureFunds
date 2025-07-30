import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
import statusCode from "http-status-codes";
import { IAuthProvider, IUSER, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
export const createUser = async (payload: IUSER) => {
  const { email, password, ...rest } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 8);
  const alreadyExist = await User.findOne({ email });

  if (alreadyExist) {
    throw new AppError(500, "user already exist");
  }
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const sendData = {
    ...rest,
    email,
    auths: [authProvider],
    password: hashedPassword,
  };

  const result = await User.create(sendData);
  return result;
};

const getAllUsers = async () => {
  const result = await User.find({});
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
