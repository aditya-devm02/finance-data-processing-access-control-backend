import { RequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "Route not found", "ROUTE_NOT_FOUND"));
};
