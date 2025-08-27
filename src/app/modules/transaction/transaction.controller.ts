/* eslint-disable @typescript-eslint/no-unused-vars */
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
      message: "Send Money done successfully",
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

// cash out
const cashOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await transactionServices.cashOut(decodedToken, req.body);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Cash Out done successfully",
      data: result,
    });
  }
);
const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await transactionServices.addMoney(decodedToken, req.body);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Add Money done successfully",
      data: result,
    });
  }
);
const AdminToAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await transactionServices.AdminToAgent(
      decodedToken,
      req.body
    );
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Add Money to agent done successfully",
      data: result,
    });
  }
);

const getAllTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await transactionServices.getAllTransaction(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "transaction retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getUserTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await transactionServices.getUserTransaction(
      decodedToken,
      req.query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "transaction retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const transactionController = {
  sendMoney,
  cashIn,
  cashOut,
  addMoney,
  getAllTransaction,
  getUserTransaction,
  AdminToAgent,
};
