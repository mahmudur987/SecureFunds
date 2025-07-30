/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { catchAsync } from "../../utils/catchAsynch";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
import { createUserToken } from "../../utils/createUserToken";
import { envVariables } from "../../config/env.config";
import passport from "passport";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(500, err.message));
      }
      if (!user) {
        return next(new AppError(500, info.message));
      }

      const result = createUserToken(user);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
      });

      sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "Login successfully",
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user,
        },
      });
    })(req, res, next);

    // const result = await authServices.credentialLogin(req.body);

    // res.cookie("refreshToken", result.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    // res.cookie("accessToken", result.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    // sendResponse(res, {
    //   statusCode: statusCode.CREATED,
    //   success: true,
    //   message: "Login successfully",
    //   data: result,
    // });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken as string;
    const result = await authServices.getNewAccessToken(refreshToken);
    res.cookie("refreshToken", result.accessToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Login successfully",
      data: result,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const result = await authServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken
    );

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "reset Password successfully",
      data: result,
    });
  }
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const newPassword = req.body.newPassword;
    const result = await authServices.setPassword(
      decodedToken._id,
      newPassword
    );

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "reset Password successfully",
      data: result,
    });
  }
);
const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const result = await authServices.forgetPassword(email);

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "reset Password successfully",
      data: result,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;

    const result = await authServices.resetPassword(payload, decodedToken);

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "reset Password successfully",
      data: result,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError(500, "user not found");
    }
    const Token = createUserToken(user);
    res.cookie("refreshToken", Token.refreshToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie("accessToken", Token.accessToken, {
      httpOnly: true,
      secure: false,
    });

    res.redirect(envVariables.FRONT_END_URL);
  }
);
const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Logout successfully",
      data: null,
    });
  }
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
  logOut,
  changePassword,
  googleCallbackController,
  setPassword,
  forgetPassword,
  resetPassword,
};
