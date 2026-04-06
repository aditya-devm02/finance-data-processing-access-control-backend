import { AuthenticatedUserModel } from "../models/auth.model";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserModel;
    }
  }
}

export {};
