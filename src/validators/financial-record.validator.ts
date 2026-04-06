import { z } from "zod";
import { paginationSchema } from "./common.validator";

const recordTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createFinancialRecordSchema = z.object({
  amount: z.number().positive(),
  type: recordTypeEnum,
  category: z.string().trim().min(2).max(100),
  date: z.coerce.date(),
  description: z.string().trim().max(500).optional(),
});

export const updateFinancialRecordSchema = z
  .object({
    amount: z.number().positive().optional(),
    type: recordTypeEnum.optional(),
    category: z.string().trim().min(2).max(100).optional(),
    date: z.coerce.date().optional(),
    description: z.string().trim().max(500).optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const listFinancialRecordsSchema = paginationSchema.extend({
  category: z.string().trim().min(1).optional(),
  type: recordTypeEnum.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
});

export const analyticsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().max(50).default(5),
});
