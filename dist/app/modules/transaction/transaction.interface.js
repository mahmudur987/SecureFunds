"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["Send-Money"] = "Send-Money";
    TransactionType["CashIn"] = "CashIn";
    TransactionType["CashOut"] = "CashOut";
    TransactionType["Add-Money"] = "Add-Money";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["success"] = "success";
    TransactionStatus["pending"] = "pending";
    TransactionStatus["failed"] = "failed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
