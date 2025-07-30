import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/success", paymentController.successPayment);
router.post("/fail", paymentController.failedPayment);
router.post("/cancel", paymentController.cancelledPayment);
router.post("/init-payment/:bookingId", paymentController.initPayment);

export const paymentRoute = router;
