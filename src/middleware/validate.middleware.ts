import { ZodError, ZodTypeAny } from "zod";
import { Request, RequestHandler } from "express";
import { AppError } from "../utils/app-error";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodTypeAny, target: ValidationTarget): RequestHandler =>
  (req, _res, next) => {
    try {
      req[target] = schema.parse(req[target]) as Request[ValidationTarget];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(400, "Validation failed", "VALIDATION_ERROR", error.flatten()));
        return;
      }

      next(error);
    }
  };
