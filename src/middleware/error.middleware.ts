import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { logger } from "../config/logger";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let normalizedError = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    normalizedError = new AppError(409, "A unique constraint was violated", "CONFLICT", error.meta);
  }

  if (!(normalizedError instanceof AppError)) {
    normalizedError = new AppError(500, "Internal server error", "INTERNAL_SERVER_ERROR");
  }

  logger.error(normalizedError.message, {
    code: normalizedError.code,
    details: normalizedError.details,
    stack: normalizedError.stack,
  });

  res.status(normalizedError.statusCode).json({
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
    },
  });
};
