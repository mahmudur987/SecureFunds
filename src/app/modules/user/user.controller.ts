/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { useServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsynch";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await useServices.createUser(req.body);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user created successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await useServices.getAllUsers();

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user created successfully",
      data: result,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const tokenVerify = req.user;

    const result = await useServices.updateUser(userId, payload, tokenVerify);

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user created successfully",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
};
