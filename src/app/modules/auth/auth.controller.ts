/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { catchAsync } from "../../utils/catchAsynch";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authServices.credentialLogin(req.body);

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
      data: result,
    });
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
};
