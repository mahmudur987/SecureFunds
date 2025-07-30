import AppError from "../../errorHandler/AppError";
import { IAuthProvider, IsActive, IUSER } from "../user/user.interface";
import { User } from "../user/user.model";
import statusCode from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserToken } from "../../utils/createUserToken";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import { envVariables } from "../../config/env.config";
import {
  UserValidationResult,
  validateUserStatus,
} from "../../middleware/validateUserStatus";
import { sendmail } from "../../utils/sendEmail";

export const jwtSecrete = "Ph-tour-Management Backend";
const credentialLogin = async (payload: Partial<IUSER>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(statusCode.BAD_REQUEST, "Email not exist");
  }
  if (!password) {
    throw new AppError(statusCode.BAD_REQUEST, "provide your password");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(statusCode.BAD_REQUEST, "Incorrect password");
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
    refreshToken: Token.refreshToken,
    user: isUserExist,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const verifyRefreshToken = verify(
    refreshToken,
    envVariables.REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  console.log(verifyRefreshToken, refreshToken);

  if (!verifyRefreshToken) {
    throw new AppError(500, "Refresh token not exist");
  }
  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(statusCode.BAD_REQUEST, "Email not exist");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(statusCode.BAD_REQUEST, "user bloked");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(statusCode.BAD_REQUEST, "user deleted");
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
export const setPassword = async (userId: string, plainPassword: string) => {
  // Step 1: Find user by decoded token ID
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }
  if (
    user.password &&
    user.auths?.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "you should login by google and set password for credential."
    );
  }

  // Step 4: Hash new password and update user
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const auths = [
    ...(user.auths as IAuthProvider[]),
    { provider: "credential", providerId: user.email as string },
  ];

  user.password = hashedPassword;
  user.auths = auths;
  await user.save();

  return {
    message: "Password has been set successfully.",
  };
};
export const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }
  const validation: UserValidationResult = validateUserStatus(user);
  if (!validation.isValid) {
    throw new AppError(statusCode.BAD_REQUEST, validation.message as string);
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    _id: user._id,
    phone: user.phone,
    role: user.role,
  };

  const resetToken = jwt.sign(jwtPayload, jwtSecrete, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVariables.FRONT_END_URL}/reset-password?token=${resetToken}&id=${user._id}`;

  const result = await sendmail({
    to: user.email,
    subject: "Reset Password",
    templateName: "forgetPassword",
    templateData: { name: user.name, resetUILink },
  });

  return result;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  // Step 1: Find user by decoded token ID
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }

  // Step 2: Compare old password
  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    user.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(statusCode.UNAUTHORIZED, "Old password is incorrect.");
  }

  // Step 3: Check if new password is same as old password
  const isSameAsOld = await bcrypt.compare(
    newPassword,
    user.password as string
  );
  if (isSameAsOld) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "New password must be different from the old password."
    );
  }

  // Step 4: Hash new password and update user
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password has been reset successfully.",
  };
};
export const resetPassword = async (
  payload: Record<string, string>,
  decodedToken: JwtPayload
) => {
  if (!payload.password || !payload.id) {
    throw new AppError(statusCode.BAD_REQUEST, "provide your Id and password");
  }

  if (payload.id !== decodedToken._id) {
    throw new AppError(statusCode.NOT_FOUND, "You can not reset your password");
  }
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found.");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  user.password = hashedPassword;
  await user.save();
  return {
    message: "Password has been reset successfully.",
  };
};
export const authServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgetPassword,
};
