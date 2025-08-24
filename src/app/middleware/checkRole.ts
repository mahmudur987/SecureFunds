import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";

import AppError from "../errorHandler/AppError";
import jwt from "jsonwebtoken";
import { jwtSecrete } from "../modules/auth/auth.service";
import statusCode from "http-status-codes";
import { User } from "../modules/user/user.model";
import { UserValidationResult, validateUserStatus } from "./validateUserStatus";
export const CheckRole =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || req.cookies.accessToken;

      if (!token) {
        throw new AppError(httpStatus.FORBIDDEN, "Unauthenticated user");
      }

      const tokenVerify: jwt.JwtPayload = jwt.verify(
        token,
        jwtSecrete
      ) as jwt.JwtPayload;

      if (!tokenVerify) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Admin verification failed for token"
        );
      }

      const isUserExist = await User.findOne({ email: tokenVerify.email });

      if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "Email not exist");
      }
      const validation: UserValidationResult = validateUserStatus(isUserExist);

      if (!validation.isValid) {
        throw new AppError(
          validation.statusCode as number,
          validation.message as string
        );
      }

      if (!authRole.includes(tokenVerify.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Unauthenticated user");
      }
      req.user = tokenVerify;
      next();
    } catch (error) {
      next(error);
    }
  };
