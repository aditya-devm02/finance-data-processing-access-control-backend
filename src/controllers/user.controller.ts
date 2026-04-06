import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  };

  listUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.listUsers();
    res.status(200).json({ success: true, data: users });
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id as string);
    res.status(200).json({ success: true, data: user });
  };

  updateUser = async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: user });
  };

  deleteUser = async (req: Request, res: Response) => {
    const result = await this.userService.deleteUser(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  };
}
