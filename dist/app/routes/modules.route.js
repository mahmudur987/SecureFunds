"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
exports.router = (0, express_1.Router)();
const Routes = [
    {
        path: "/user",
        route: user_route_1.userRoute,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoute,
    },
    {
        path: "/wallet",
        route: wallet_route_1.walletRoute,
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoute,
    },
];
Routes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
