import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { analyticsQuerySchema } from "../validators/financial-record.validator";

const router = Router();
const controller = new AnalyticsController();

router.get(
  "/summary",
  authenticate,
  authorize("ANALYST", "ADMIN"),
  validate(analyticsQuerySchema, "query"),
  asyncHandler(controller.getDetailedAnalytics),
);

export { router as analyticsRoutes };
