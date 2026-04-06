import { Router } from "express";
import { analyticsRoutes } from "./analytics.routes";
import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { financialRecordRoutes } from "./financial-record.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/records", financialRecordRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);

export { router as apiRoutes };
