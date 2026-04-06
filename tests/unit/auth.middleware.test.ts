import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { authenticate } from "../../src/middleware/auth.middleware";

jest.mock("../../src/utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

import { verifyToken } from "../../src/utils/jwt";

describe("authenticate middleware", () => {
  const next = jest.fn() as NextFunction;
  const res = {} as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("attaches the authenticated user to the request", () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    } as Request;

    (verifyToken as jest.Mock).mockReturnValue({
      sub: "user-1",
      email: "admin@example.com",
      role: "ADMIN",
      status: "ACTIVE",
    });

    authenticate(req, res, next);

    expect(req.user).toEqual({
      id: "user-1",
      email: "admin@example.com",
      role: "ADMIN",
      status: "ACTIVE",
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects expired tokens with the correct error code", () => {
    const req = {
      headers: {
        authorization: "Bearer expired-token",
      },
    } as Request;

    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new jwt.TokenExpiredError("jwt expired", new Date("2026-04-03T00:00:00.000Z"));
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: "TOKEN_EXPIRED",
      }),
    );
  });

  it("requires a bearer token header", () => {
    const req = {
      headers: {},
    } as Request;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: "AUTH_REQUIRED",
      }),
    );
  });
});
