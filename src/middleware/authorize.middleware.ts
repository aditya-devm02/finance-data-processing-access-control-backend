import { Role } from "@prisma/client";
import { RequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const authorize = (...roles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication is required", "AUTH_REQUIRED"));
      return;
    }

    if (req.user.status !== "ACTIVE") {
      next(new AppError(403, "Inactive users cannot access this resource", "USER_INACTIVE"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      // Centralized RBAC checks keep authorization rules consistent across the entire API surface.
      next(new AppError(403, "You do not have permission to access this resource", "FORBIDDEN"));
      return;
    }

    next();
  };
};
