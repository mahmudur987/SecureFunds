import { Router } from "express";
import { CheckRole } from "../../middleware/checkRole";
import { transactionController } from "./transaction.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { transactionValidationSchema } from "./transaction.validate";

const router = Router();

// user to user send money

router.post(
  "/send-money",
  validateRequest(transactionValidationSchema),
  CheckRole("USER"),
  transactionController.sendMoney
);

// user to agent cashOut

router.post("/cashOut", CheckRole("USER"));

// agent to user cashIn

router.post(
  "/cashIn",
  validateRequest(transactionValidationSchema),
  CheckRole("AGENT"),
  transactionController.cashIn
);

// bank to user addMoney

router.post("/addMoney", CheckRole("ADMIN"));

// admin to agent addMoney

router.post("/addBalance", CheckRole("ADMIN"));

export const transactionRoute = router;
