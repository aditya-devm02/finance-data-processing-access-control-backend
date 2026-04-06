import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { analyticsQuerySchema } from "../validators/financial-record.validator";

const router = Router();
const controller = new DashboardController();

router.get(
  "/summary",
  authenticate,
  authorize("VIEWER", "ANALYST", "ADMIN"),
  validate(analyticsQuerySchema, "query"),
  asyncHandler(controller.getSummary),
);

export { router as dashboardRoutes };
