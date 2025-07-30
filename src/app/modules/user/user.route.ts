import { Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema, updateUserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyAdmin } from "../../middleware/verifyAdmin";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get("/", userController.getAllUsers);
router.patch(
  "/:id",
  verifyAdmin(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

export const userRoute = router;
