import { Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema, updateUserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { CheckRole } from "../../middleware/checkRole";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/create-user",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get("/", CheckRole("ADMIN"), userController.getAllUsers);
router.get(
  "/profile",
  CheckRole(...Object.values(Role)),
  userController.getSingleUser
);
router.patch(
  "/profile",
  CheckRole(...Object.values(Role)),
  userController.updateUserProfile
);
router.patch(
  "/:id",
  CheckRole("ADMIN"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

export const userRoute = router;
