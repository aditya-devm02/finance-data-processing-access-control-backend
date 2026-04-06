import { NextFunction, Request, Response } from "express";
import { authorize } from "../../src/middleware/authorize.middleware";

describe("authorize middleware", () => {
  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows access when the user has the required role", () => {
    const req = {
      user: {
        id: "analyst-1",
        email: "analyst@example.com",
        role: "ANALYST",
        status: "ACTIVE",
      },
    } as Request;

    authorize("ANALYST", "ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("rejects inactive users", () => {
    const req = {
      user: {
        id: "viewer-1",
        email: "viewer@example.com",
        role: "VIEWER",
        status: "INACTIVE",
      },
    } as Request;

    authorize("VIEWER", "ANALYST", "ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: "USER_INACTIVE",
      }),
    );
  });

  it("rejects users without the required role", () => {
    const req = {
      user: {
        id: "viewer-1",
        email: "viewer@example.com",
        role: "VIEWER",
        status: "ACTIVE",
      },
    } as Request;

    authorize("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: "FORBIDDEN",
      }),
    );
  });
});
