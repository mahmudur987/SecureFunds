"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsynch_1 = require("../../utils/catchAsynch");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const transaction_services_1 = require("./transaction.services");
const sendMoney = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_services_1.transactionServices.sendMoney(decodedToken, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Send Money done successfully",
        data: result,
    });
}));
const cashIn = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_services_1.transactionServices.cashIn(decodedToken, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash In done successfully",
        data: result,
    });
}));
// cash out
const cashOut = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_services_1.transactionServices.cashOut(decodedToken, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash Out done successfully",
        data: result,
    });
}));
const addMoney = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_services_1.transactionServices.addMoney(decodedToken, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Add Money done successfully",
        data: result,
    });
}));
const getAllTransaction = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_services_1.transactionServices.getAllTransaction(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "transaction retrieved successfully",
        data: result,
    });
}));
const getUserTransaction = (0, catchAsynch_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_services_1.transactionServices.getUserTransaction(decodedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "transaction retrieved successfully",
        data: result,
    });
}));
exports.transactionController = {
    sendMoney,
    cashIn,
    cashOut,
    addMoney,
    getAllTransaction,
    getUserTransaction,
};
