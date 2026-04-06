import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { idParamSchema } from "../validators/common.validator";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();
const controller = new UserController();

router.use(authenticate, authorize("ADMIN"));

router.get("/", asyncHandler(controller.listUsers));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(controller.getUserById));
router.post("/", validate(createUserSchema, "body"), asyncHandler(controller.createUser));
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateUserSchema, "body"),
  asyncHandler(controller.updateUser),
);
router.delete("/:id", validate(idParamSchema, "params"), asyncHandler(controller.deleteUser));

export { router as userRoutes };
