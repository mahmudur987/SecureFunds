/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { walletService } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsynch";

const getAllWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await walletService.getAllWallet();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallets retrieved successfully",
      data: result,
    });
  }
);

const updateWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await walletService.updateWallet(
      req.params.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet updated successfully",
      data: result,
    });
  }
);

export const walletController = {
  getAllWallets,
  updateWallet,
};
