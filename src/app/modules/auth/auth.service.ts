import AppError from "../../errorHandler/AppError";
import { IUSER, Status } from "../user/user.interface";
import { User } from "../user/user.model";
import statusCode from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserToken } from "../../utils/createUserToken";
import { JwtPayload, verify } from "jsonwebtoken";
import { envVariables } from "../../config/env.config";
import {
  UserValidationResult,
  validateUserStatus,
} from "../../middleware/validateUserStatus";

export const jwtSecrete = "Ph-tour-Management Backend";
const credentialLogin = async (payload: Partial<IUSER>) => {
  const { phone, password } = payload;

  const isUserExist = await User.findOne({ phone }).populate("wallet");

  if (!isUserExist) {
    throw new AppError(statusCode.BAD_REQUEST, "Phone not exist");
  }
  if (!password) {
    throw new AppError(statusCode.BAD_REQUEST, "provide your password");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    if (Number(isUserExist.loginWrongAttempts) <= 2) {
      isUserExist.loginWrongAttempts =
        (Number(isUserExist.loginWrongAttempts) as number) + 1;
      await isUserExist.save();
      throw new AppError(statusCode.BAD_REQUEST, "Incorrect password");
    } else {
      isUserExist.status = Status.SUSPENDED;
      await isUserExist.save();
      throw new AppError(statusCode.BAD_REQUEST, "You are Suspended");
    }
  }
  const validation: UserValidationResult = validateUserStatus(isUserExist);
  if (!validation.isValid) {
    throw new AppError(statusCode.BAD_REQUEST, validation.message as string);
  }
  const jwtPayload = {
    name: isUserExist.name,
    email: isUserExist.email,
    _id: isUserExist._id,
    phone: isUserExist.phone,
    role: isUserExist.role,
  };

  const Token = createUserToken(jwtPayload);

  isUserExist.loginAttempts = (Number(isUserExist.loginAttempts) as number) + 1;
  isUserExist.lastLogin = new Date();
  await isUserExist.save();

  return {
    accessToken: Token.accessToken,
    refreshToken: Token.refreshToken,
    user: isUserExist,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const verifyRefreshToken = verify(
    refreshToken,
    envVariables.REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  // console.log(verifyRefreshToken, refreshToken);

  if (!verifyRefreshToken) {
    throw new AppError(500, "Refresh token not exist");
  }
  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(statusCode.BAD_REQUEST, "Email not exist");
  }
  const validation: UserValidationResult = validateUserStatus(isUserExist);
  if (!validation.isValid) {
    throw new AppError(statusCode.BAD_REQUEST, validation.message as string);
  }

  const jwtPayload = {
    name: isUserExist.name,
    email: isUserExist.email,
    _id: isUserExist._id,
    phone: isUserExist.phone,
    role: isUserExist.role,
  };

  const Token = createUserToken(jwtPayload);

  return {
    accessToken: Token.accessToken,
  };
};
export const authServices = {
  credentialLogin,
  getNewAccessToken,
};
