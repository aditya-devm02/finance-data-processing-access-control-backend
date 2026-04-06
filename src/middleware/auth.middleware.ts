import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Role, UserStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Authorization token is required", "AUTH_REQUIRED"));
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyToken(token);
    // Store a normalized authenticated user object on the request so downstream code never re-parses JWT data.
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      status: payload.status as UserStatus,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError(401, "Token has expired", "TOKEN_EXPIRED"));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid authentication token", "INVALID_TOKEN"));
      return;
    }

    next(error);
  }
};
