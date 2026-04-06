import { Router } from "express";
import { FinancialRecordController } from "../controllers/financial-record.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { idParamSchema } from "../validators/common.validator";
import {
  createFinancialRecordSchema,
  listFinancialRecordsSchema,
  updateFinancialRecordSchema,
} from "../validators/financial-record.validator";

const router = Router();
const controller = new FinancialRecordController();

router.use(authenticate);

router.get(
  "/",
  authorize("ANALYST", "ADMIN"),
  validate(listFinancialRecordsSchema, "query"),
  asyncHandler(controller.listRecords),
);
router.get(
  "/:id",
  authorize("ANALYST", "ADMIN"),
  validate(idParamSchema, "params"),
  asyncHandler(controller.getRecordById),
);
router.post(
  "/",
  authorize("ADMIN"),
  validate(createFinancialRecordSchema, "body"),
  asyncHandler(controller.createRecord),
);
router.patch(
  "/:id",
  authorize("ADMIN"),
  validate(idParamSchema, "params"),
  validate(updateFinancialRecordSchema, "body"),
  asyncHandler(controller.updateRecord),
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate(idParamSchema, "params"),
  asyncHandler(controller.deleteRecord),
);

export { router as financialRecordRoutes };
