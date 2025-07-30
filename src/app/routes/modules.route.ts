import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { walletRoute } from "../modules/wallet/wallet.route";
import { transactionRoute } from "../modules/transaction/transaction.route";

export const router = Router();

const Routes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/wallet",
    route: walletRoute,
  },
  {
    path: "/transaction",
    route: transactionRoute,
  },
];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});
