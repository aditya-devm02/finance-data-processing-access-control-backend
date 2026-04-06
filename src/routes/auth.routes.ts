import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../validators/auth.validator";

const router = Router();
const controller = new AuthController();

router.post("/login", validate(loginSchema, "body"), asyncHandler(controller.login));

export { router as authRoutes };
