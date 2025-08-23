/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { useServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsynch";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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
    const result = await useServices.getAllUsers(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await useServices.getSingleUser(decodedToken);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user retrieved successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const result = await useServices.updateUser(userId, payload);
    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: "user updated successfully",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
};
