"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoute = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const checkRole_1 = require("../../middleware/checkRole");
const validateRequest_1 = require("../../middleware/validateRequest");
const wallet_validate_1 = require("./wallet.validate");
const router = (0, express_1.Router)();
router.get("/", (0, checkRole_1.CheckRole)("ADMIN"), wallet_controller_1.walletController.getAllWallets);
// update wallet
router.patch("/:userId", (0, checkRole_1.CheckRole)("ADMIN"), (0, validateRequest_1.validateRequest)(wallet_validate_1.updateWalletZodSchema), wallet_controller_1.walletController.updateWallet);
exports.walletRoute = router;
