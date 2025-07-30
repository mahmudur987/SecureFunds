import { Router } from "express";

import { authController } from "./auth.controller";
import { verifyAdmin } from "../../middleware/verifyAdmin";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVariables } from "../../config/env.config";

const route = Router();

route.post("/login", authController.credentialLogin);
route.post("/refreshToken", authController.getNewAccessToken);
route.post("/logout", authController.logOut);
route.post(
  "/changePassword",
  verifyAdmin(...Object.values(Role)),
  authController.changePassword
);
route.patch(
  "/setPassword",
  verifyAdmin(...Object.values(Role)),
  authController.setPassword
);
route.post("/forget-password", authController.forgetPassword);
route.post(
  "/reset-password",
  verifyAdmin(...Object.values(Role)),
  authController.resetPassword
);

route.get("/google", async (req, res, next) => {
  const redirect = req.query.redirect;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});

route.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user, info) => {
      if (err) {
        console.error("Google authentication error:", err);
        return next(err);
      }

      if (!user) {
        // Handle error message from `done(null, false, { message: "..." })`
        return res.redirect(
          `${envVariables.FRONT_END_URL}/login?error=${encodeURIComponent(
            info?.message || "Google login failed"
          )}`
        );
      }

      // Manually attach user to req for controller
      req.user = user;
      return authController.googleCallbackController(req, res, next);
    }
  )(req, res, next);
});
// route.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   authController.googleCallbackController
// );
export const authRoute = route;
