import { catchAsync } from "../../utils/catchAsynch";
import statusCode from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { transactionServices } from "./transaction.services";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await transactionServices.sendMoney(decodedToken, req.body);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "TSend Money done successfully",
      data: result,
    });
  }
);
const cashIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await transactionServices.cashIn(decodedToken, req.body);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Cash In done successfully",
      data: result,
    });
  }
);
export const transactionController = {
  sendMoney,
  cashIn,
};
