import { Router } from "express";
import { userRoute } from "../modules/user/user.route";

export const router = Router();

const Routes = [
  {
    path: "/user",
    route: userRoute,
  },
];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});
