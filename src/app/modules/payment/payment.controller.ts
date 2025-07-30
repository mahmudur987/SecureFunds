import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsynch";
import { paymentServices } from "./payment.service";

import { envVariables } from "../../config/env.config";
import StatusCodes from "http-status-codes";
import sendResponse from "../../utils/sendResponse";

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentServices.successPayment(
      req.query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVariables.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=success`
      );
    }
  }
);
const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentServices.failedPayment(
      req.query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVariables.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=fail`
      );
    }
  }
);

const cancelledPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentServices.cancelledPayment(
      req.query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVariables.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=cancelf`
      );
    }
  }
);
const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.initPayment(req.params.bookingId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "payment created successfully",
    data: result,
  });
});
export const paymentController = {
  successPayment,
  failedPayment,
  cancelledPayment,
  initPayment,
};
