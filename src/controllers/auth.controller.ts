import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body.email, req.body.password);

    res.status(200).json({
      success: true,
      data: result,
    });
  };
}
