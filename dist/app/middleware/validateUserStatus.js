"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWalletStatus = exports.validateUserStatus = void 0;
const user_interface_1 = require("../modules/user/user.interface");
const wallet_interface_1 = require("../modules/wallet/wallet.interface");
const validateUserStatus = (user) => {
    if (!user) {
        return {
            isValid: false,
            message: "User does not exist",
            statusCode: 400,
        };
    }
    if (user.status === user_interface_1.Status.BLOCKED) {
        return {
            isValid: false,
            message: "Your account is blocked",
            statusCode: 400,
        };
    }
    if (user.status === user_interface_1.Status.SUSPENDED) {
        return {
            isValid: false,
            message: "Your account is suspended",
            statusCode: 400,
        };
    }
    if (user.isDeleted) {
        return {
            isValid: false,
            message: "User is deleted",
            statusCode: 400,
        };
    }
    if (!user.isEmailVerified) {
        return {
            isValid: false,
            message: "User email is not verified",
            statusCode: 400,
        };
    }
    if (!user.isPhoneVerified) {
        return {
            isValid: false,
            message: "User phone is not verified",
            statusCode: 400,
        };
    }
    return {
        isValid: true,
    };
};
exports.validateUserStatus = validateUserStatus;
const validateWalletStatus = (wallet) => {
    if (!wallet) {
        return {
            isValid: false,
            message: "Wallet does not exist",
            statusCode: 400,
        };
    }
    if (wallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
        return {
            isValid: false,
            message: "Wallet is blocked",
            statusCode: 400,
        };
    }
    if (wallet.status === wallet_interface_1.WalletStatus.SUSPENDED) {
        return {
            isValid: false,
            message: "Wallet is suspended",
            statusCode: 400,
        };
    }
    if (wallet.status === wallet_interface_1.WalletStatus.PENDING) {
        return {
            isValid: false,
            message: "Wallet is pending wait for admin approval",
            statusCode: 400,
        };
    }
    return {
        isValid: true,
    };
};
exports.validateWalletStatus = validateWalletStatus;
