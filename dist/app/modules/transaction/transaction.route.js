"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoute = void 0;
const express_1 = require("express");
const checkRole_1 = require("../../middleware/checkRole");
const transaction_controller_1 = require("./transaction.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const transaction_validate_1 = require("./transaction.validate");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// user to user send money
router.post("/send-money", (0, validateRequest_1.validateRequest)(transaction_validate_1.transactionValidationSchema), (0, checkRole_1.CheckRole)("USER"), transaction_controller_1.transactionController.sendMoney);
// user to agent cashOut
router.post("/cashOut", (0, validateRequest_1.validateRequest)(transaction_validate_1.transactionValidationSchema), (0, checkRole_1.CheckRole)("USER"), transaction_controller_1.transactionController.cashOut);
// agent to user cashIn
router.post("/cashIn", (0, validateRequest_1.validateRequest)(transaction_validate_1.transactionValidationSchema), (0, checkRole_1.CheckRole)("AGENT"), transaction_controller_1.transactionController.cashIn);
// bank to user addMoney
router.post("/addMoney", (0, validateRequest_1.validateRequest)(transaction_validate_1.transactionValidationSchema), (0, checkRole_1.CheckRole)("USER"), transaction_controller_1.transactionController.addMoney);
// admin to agent addMoney
router.post("/addBalance", (0, checkRole_1.CheckRole)("ADMIN"));
// get all transaction
router.get("/", (0, checkRole_1.CheckRole)("ADMIN"), transaction_controller_1.transactionController.getAllTransaction);
//get  user transaction
router.get("/user-transaction", (0, checkRole_1.CheckRole)(user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN), transaction_controller_1.transactionController.getUserTransaction);
exports.transactionRoute = router;
