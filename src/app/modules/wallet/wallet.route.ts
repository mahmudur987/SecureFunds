import { Router } from "express";
import { walletController } from "./wallet.controller";
import { CheckRole } from "../../middleware/checkRole";
import { validateRequest } from "../../middleware/validateRequest";
import { updateWalletZodSchema } from "./wallet.validate";

const router = Router();

router.get("/", CheckRole("ADMIN"), walletController.getAllWallets);

// update wallet

router.patch(
  "/:userId",
  CheckRole("ADMIN"),
  validateRequest(updateWalletZodSchema),
  walletController.updateWallet
);

export const walletRoute = router;
