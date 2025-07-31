import { Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema, updateUserZodSchema } from "./user.validate";
import { validateRequest } from "../../middleware/validateRequest";
import { CheckRole } from "../../middleware/checkRole";

const router = Router();

router.post(
  "/create-user",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get("/", CheckRole("ADMIN"), userController.getAllUsers);
router.patch(
  "/:id",
  CheckRole("ADMIN"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

export const userRoute = router;
