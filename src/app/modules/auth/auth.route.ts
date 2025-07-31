import { Router } from "express";

import { authController } from "./auth.controller";

const route = Router();

route.post("/login", authController.credentialLogin);
route.post("/refreshToken", authController.getNewAccessToken);
route.post("/logout", authController.logOut);

export const authRoute = route;
